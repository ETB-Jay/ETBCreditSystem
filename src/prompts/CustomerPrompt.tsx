// ─ Imports ──────────────────────────────────────────────────────────────────────────────────────
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { useState, useEffect, useMemo } from "react";

import { Prompt, PromptButton, PromptField, PromptInput } from "../components";
import { useDisplay, useCustomerNames, useTotal } from "../context/useContext";
import { db, fetchCustomersOnce, getHighestCustomerId } from "../firebase";
import { getDocumentName, validateCustomerInfo, getCustomerDoc } from "./scripts";

import type { Customer } from "../types";

/**
 * Checks if an object is empty (has no own properties and is a plain object).
 * @param obj The object to check.
 */
const isEmptyObject = (obj: object) => Object.keys(obj).length === 0 && obj.constructor === Object;

/**
 * Displays a prompt for adding a new customer.
 * @returns The CustomerPrompt component.
 */
function CustomerPrompt() {
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
    if (isSubmitting) { return; }
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
      } catch (error) {
        // eslint-disable-next-line no-console
        console.warn(error);
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

  const submitLabel = useMemo(() => isSubmitting ? "Processing..." : "Confirm", [isSubmitting]);

  return (
    <Prompt title="New Customer">
      <PromptField error={errors.firstName}>
        <PromptInput
          label="First Name"
          icon={<DriveFileRenameOutlineIcon fontSize="small" />}
          type="text"
          value={newCustomer.firstName ?? ""}
          onChange={(ev) => setNewCustomer({ ...newCustomer, firstName: ev.target.value })}
          placeholder="Enter your first name"
          disabled={isSubmitting}
        />
      </PromptField>
      <PromptField error={errors.lastName}>
        <PromptInput
          label="Last Name"
          icon={<DriveFileRenameOutlineIcon fontSize="small" />}
          type="text"
          value={newCustomer.lastName ?? ""}
          onChange={(ev) => setNewCustomer({ ...newCustomer, lastName: ev.target.value })}
          placeholder="Enter your last name"
          disabled={isSubmitting}
        />
      </PromptField>
      <PromptField error={errors.email}>
        <PromptInput
          label="Email"
          icon={<EmailIcon fontSize="small" />}
          name="email"
          type="email"
          value={newCustomer.email ?? ""}
          onChange={(ev) => setNewCustomer({ ...newCustomer, email: ev.target.value })}
          placeholder="Enter your email"
          disabled={isSubmitting}
        />
      </PromptField>
      <PromptField error={errors.phone}>
        <PromptInput
          label="Phone Number"
          icon={<PhoneIcon fontSize="small" />}
          name="phone"
          type="tel"
          value={newCustomer.phone ?? ""}
          onChange={(ev) => setNewCustomer({ ...newCustomer, phone: ev.target.value })}
          placeholder="(123) 456-7890"
          disabled={isSubmitting}
        />
      </PromptField>
      <div className="flex justify-end space-x-3">
        <PromptButton
          onClick={handleSubmit}
          disabled={isSubmitting}
          label={submitLabel}
          icon={null}
        />
        <PromptButton onClick={handleCancel} disabled={isSubmitting} label="Cancel" icon={null} />
      </div>
    </Prompt>
  );
}

// ─ Exports ──────────────────────────────────────────────────────────────────────────────────────
export default CustomerPrompt;
