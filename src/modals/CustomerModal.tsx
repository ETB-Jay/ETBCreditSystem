import { doc, updateDoc, setDoc } from "firebase/firestore";
import { useState, useEffect, useMemo, ReactElement } from "react";

import {
  Modal,
  ModalField,
  ModalInput,
  EditIcon,
  EmailIcon,
  PhoneIcon,
  ModalButtonGroup,
} from "../components";
import { useCustomerNames, useDisplay, useTotal } from "../context/Context";
import { getHighestCustomerId, db, fetchCustomersOnce } from "../firebase";
import { validateCustomerInfo, getDocumentName, getCustomerDoc } from "./scripts";

import type { Customer } from "../types";

/**
 * Checks if an object is empty (has no own properties and is a plain object).
 * @param obj The object to check.
 */
const isEmptyObject = (obj: object) => Object.keys(obj).length === 0 && obj.constructor === Object;

/**
 * Displays a modal for adding a new customer.
 * @returns The CustomerModal component.
 */
const CustomerModal = (): ReactElement => {
  const { setCustomers } = useCustomerNames();
  const [newCustomer, setNewCustomer] = useState<Partial<Customer>>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { setDisplay } = useDisplay();
  const { setTotal } = useTotal();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setNewCustomer({ firstName: "", lastName: "", email: "", phone: "" });
    setErrors({});
  }, []);

  const handleSubmit = async () => {
    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true);

    const errs = validateCustomerInfo(newCustomer);
    if (typeof errs === "string") {
      setErrors({ submit: errs });
      setIsSubmitting(false);
      return;
    }
    if (Object.values(errs).some((val) => val)) {
      setErrors(errs);
      setIsSubmitting(false);
      return;
    }

    try {
      const highestCustomerId = await getHighestCustomerId();
      const newCustomerId = highestCustomerId + 1;
      const arrayName = getDocumentName(newCustomerId);
      const currentCustomers = await getCustomerDoc(arrayName);
      const docRef = doc(db, "customers", arrayName);

      const customerData = {
        customerID: newCustomerId,
        firstName: (newCustomer.firstName ?? "").trim(),
        lastName: (newCustomer.lastName ?? "").trim(),
        email: (newCustomer.email ?? "").trim(),
        phone: (newCustomer.phone ?? "").trim(),
        balance: 0,
        transactions: [],
      };

      if (currentCustomers.length > 0 && !isEmptyObject(currentCustomers[0])) {
        await updateDoc(docRef, {
          customers: [...currentCustomers, customerData],
          count: currentCustomers.length + 1,
        });
      } else {
        await setDoc(docRef, {
          count: 1,
          customers: [customerData],
        });
      }
      try {
        const customersData = await fetchCustomersOnce();
        setCustomers(customersData.customers);
        setTotal(customersData.total);
      } catch {
        setErrors({
          submit: "Customer added but failed to refresh the list. Please refresh the page.",
        });
      }
      setDisplay("default");
    } catch {
      setErrors({ submit: "Failed to add customer. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setNewCustomer({});
    setErrors({});
    setDisplay("default");
  };

  const submitLabel = useMemo(() => (isSubmitting ? "Processing..." : "Confirm"), [isSubmitting]);

  return (
    <Modal title="Add New Customer">
      <form
        className="flex w-full flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          handleSubmit();
        }}
      >
        <ModalField error={errors.firstName}>
          <ModalInput
            icon={<EditIcon />}
            type="text"
            value={newCustomer.firstName ?? ""}
            onChange={(ev) => setNewCustomer({ ...newCustomer, firstName: ev.target.value })}
            placeholder="Enter your first name"
            disabled={isSubmitting}
          />
        </ModalField>
        <ModalField error={errors.lastName}>
          <ModalInput
            icon={<EditIcon />}
            type="text"
            value={newCustomer.lastName ?? ""}
            onChange={(ev) => setNewCustomer({ ...newCustomer, lastName: ev.target.value })}
            placeholder="Enter your last name"
            disabled={isSubmitting}
          />
        </ModalField>
        <ModalField error={errors.email}>
          <ModalInput
            icon={<EmailIcon />}
            type="email"
            value={newCustomer.email ?? ""}
            onChange={(ev) => setNewCustomer({ ...newCustomer, email: ev.target.value })}
            placeholder="Enter your email"
            disabled={isSubmitting}
          />
        </ModalField>
        <ModalField error={errors.phone}>
          <ModalInput
            icon={<PhoneIcon />}
            type="tel"
            value={newCustomer.phone ?? ""}
            onChange={(ev) => setNewCustomer({ ...newCustomer, phone: ev.target.value })}
            placeholder="(123) 456-7890"
            disabled={isSubmitting}
          />
        </ModalField>
        {errors.submit && (
          <ModalField error={errors.submit}>
            <div className="h-0" />
          </ModalField>
        )}
        <ModalButtonGroup
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          submitLabel={submitLabel}
          isSubmitting={isSubmitting}
        />
      </form>
    </Modal>
  );
};

export default CustomerModal;
