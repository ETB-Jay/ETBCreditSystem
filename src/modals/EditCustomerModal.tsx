import { updateDoc, doc } from "firebase/firestore";
import { useState, useMemo, ChangeEvent, ReactElement } from "react";

import {
  Modal,
  ModalField,
  ModalInput,
  EditIcon,
  EmailIcon,
  PhoneIcon,
  ModalButtonGroup,
} from "../components";
import { useCustomer, useDisplay, useCustomerNames } from "../context/Context";
import { db } from "../firebase";
import { Customer } from "../types";
import { validateCustomerInfo, getDocumentName, getCustomerDoc } from "./scripts";

/** Displays a modal for editing customer information. */
const EditCustomerModal = (): ReactElement => {
  const { customer, setCustomer } = useCustomer();
  const { setDisplay } = useDisplay();
  const { setCustomers } = useCustomerNames();
  const [temp, setTemp] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  }>({
    firstName: customer?.firstName || "",
    lastName: customer?.lastName || "",
    email: customer?.email || "",
    phone: customer?.phone || "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleInputChange = (ev: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = ev.target;
    setTemp((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (isSubmitting) {
      return false;
    }
    setIsSubmitting(true);
    setErrors({});

    const errs = validateCustomerInfo(temp);
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
      if (!customer) {
        throw new Error("Customer data is not properly loaded");
      }

      const arrayName = getDocumentName(customer.customerID);
      const currentCustomers = await getCustomerDoc(arrayName);

      const updatedData = {
        firstName: temp.firstName.trim(),
        lastName: temp.lastName.trim(),
        email: temp.email.trim() || "",
        phone: temp.phone.trim() || "",
      };
      const updatedCustomers = currentCustomers.map((cus: Customer) => {
        if (cus.customerID === customer.customerID) {
          return {
            ...cus,
            ...updatedData,
          };
        }
        return cus;
      });
      await updateDoc(doc(db, "customers", arrayName), {
        customers: updatedCustomers,
      });
      setCustomers((prevCustomers: Customer[]) =>
        prevCustomers.map((cus: Customer) =>
          cus.customerID === customer.customerID
            ? {
                ...cus,
                firstName: temp.firstName,
                lastName: temp.lastName,
                email: temp.email,
                phone: temp.phone,
              }
            : cus
        )
      );
      setCustomer(
        updatedCustomers.find((cus: Customer) => cus.customerID === customer.customerID) || null
      );

      setDisplay("default");
      return true;
    } catch {
      setErrors({ submit: "Failed to update customer. Please try again." });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setTemp({
      firstName: customer?.firstName || "",
      lastName: customer?.lastName || "",
      email: customer?.email || "",
      phone: customer?.phone || "",
    });
    setErrors({});
    setDisplay("default");
  };

  const submitLabel = useMemo(() => (isSubmitting ? "Processing..." : "Confirm"), [isSubmitting]);

  return (
    <Modal title="Edit Customer Information">
      <form
        className="flex flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          handleSubmit();
        }}
      >
        <ModalField error={errors.firstName}>
          <ModalInput
            icon={<EditIcon sx={{ width: 20, height: 20 }} />}
            type="text"
            value={temp.firstName}
            onChange={handleInputChange}
            placeholder="Enter your first name"
            disabled={isSubmitting}
          />
        </ModalField>
        <ModalField error={errors.lastName}>
          <ModalInput
            icon={<EditIcon sx={{ width: 20, height: 20 }} />}
            type="text"
            value={temp.lastName}
            onChange={handleInputChange}
            placeholder="Enter your last name"
            disabled={isSubmitting}
          />
        </ModalField>
        <ModalField error={errors.email}>
          <ModalInput
            icon={<EmailIcon sx={{ width: 20, height: 20 }} />}
            type="email"
            value={temp.email}
            onChange={handleInputChange}
            placeholder="Enter your email"
            disabled={isSubmitting}
          />
        </ModalField>
        <ModalField error={errors.phone}>
          <ModalInput
            icon={<PhoneIcon sx={{ width: 20, height: 20 }} />}
            type="tel"
            value={temp.phone}
            onChange={handleInputChange}
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

export default EditCustomerModal;
