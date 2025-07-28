// ─ Imports ──────────────────────────────────────────────────────────────────────────────────────
import { getDoc, doc } from "firebase/firestore";

import { db } from "../firebase";
import { Customer } from "../types";

type ErrorProp = Record<string, string>;

/**
 * Validates customer information for required fields and format.
 * @param customer - The customer object to validate.
 * @returns An object with error messages for each field, or a string if the customer is not loaded.
 */
const validateCustomerInfo = (customer: Partial<Customer>): Record<string, string> | string => {
  const errs: ErrorProp = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  };

  if (!customer.firstName) {
    errs.first_name = "First name is required";
  }
  if (!customer.lastName) {
    errs.last_name = "Last name is required";
  }

  const emailTrimmed = customer.email?.trim() || "";
  const phoneTrimmed = customer.phone?.trim() || "";
  const phoneDigits = phoneTrimmed.replace(/\D/g, "");
  if (emailTrimmed && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(emailTrimmed)) {
    errs.email = "Please enter a valid email address";
  }
  if (phoneTrimmed && phoneDigits.length !== 10) {
    errs.phone = "Phone number must be 10 digits";
  }
  return errs;
};

/**
 * Generates the Firestore document name for a customer based on their ID.
 * @param id - The customer ID.
 * @returns The document name string.
 */
const getDocumentName = (id: number): string => {
  const min = Math.floor((id - 1) / 100) * 100 + 1;
  const max = min + 99;
  return `${min}_min_${max}_max`;
};

/**
 * Fetches the customer array from Firestore for a given document name.
 * @param arrayName - The Firestore document name.
 * @returns The array of customers from the document.
 */
const getCustomerDoc = async (arrayName: string): Promise<Customer[]> => {
  const customerDoc = await getDoc(doc(db, "customers", arrayName));
  const currentCustomers = customerDoc.data()?.customers || [];
  return currentCustomers;
};

// ─ Exports ──────────────────────────────────────────────────────────────────────────────────────
export { validateCustomerInfo, getDocumentName, getCustomerDoc };
