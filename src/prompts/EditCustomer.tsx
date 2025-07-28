// ─ Imports ──────────────────────────────────────────────────────────────────────────────────────
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import { doc, updateDoc } from "firebase/firestore";
import React, { useMemo, useState } from "react";

import { Prompt, PromptButton, PromptField, PromptInput } from "../components";
import { useCustomer, useDisplay, useCustomerNames } from "../context/useContext";
import { db } from "../firebase";
import { getCustomerDoc, getDocumentName, validateCustomerInfo } from "./scripts";
import { Customer } from "../types";

/**
 * Displays a prompt for editing customer information.
 * @returns The EditCustomer component.
 */
function EditCustomer() {
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

  const handleInputChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
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

  const submitLabel = useMemo(() => isSubmitting ? "Processing..." : "Confirm", [isSubmitting]);

  return (
    <Prompt title="Edit Customer Information">
      <PromptField error={errors.firstName}>
        <PromptInput
          label="First Name"
          icon={<DriveFileRenameOutlineIcon fontSize="small" />}
          type="text"
          name="firstName"
          value={temp.firstName}
          onChange={handleInputChange}
          placeholder="Enter your first name"
          disabled={isSubmitting}
        />
      </PromptField>
      <PromptField error={errors.lastName}>
        <PromptInput
          label="Last Name"
          icon={<DriveFileRenameOutlineIcon fontSize="small" />}
          type="text"
          name="lastName"
          value={temp.lastName}
          onChange={handleInputChange}
          placeholder="Enter your last name"
          disabled={isSubmitting}
        />
      </PromptField>
      <PromptField error={errors.email}>
        <PromptInput
          label="Email"
          icon={<EmailIcon fontSize="small" />}
          type="email"
          name="email"
          value={temp.email}
          onChange={handleInputChange}
          placeholder="Enter your email"
          disabled={isSubmitting}
        />
      </PromptField>
      <PromptField error={errors.phone}>
        <PromptInput
          label="Phone Number"
          icon={<PhoneIcon fontSize="small" />}
          type="tel"
          name="phone"
          value={temp.phone}
          onChange={handleInputChange}
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
export default EditCustomer;
