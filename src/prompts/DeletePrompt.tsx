import { doc, updateDoc } from "firebase/firestore";
import { ReactElement, useState } from "react";

import { Prompt, PromptField, PromptInput, PromptButton } from "../components";
import { useDisplay, useCustomer, useCustomerNames } from "../context/useContext";
import { db } from "../firebase";
import { getDocumentName, getCustomerDoc } from "./scripts";
import { Customer } from "../types";

/**
 * Displays a prompt for confirming and deleting a customer.
 * @returns The DeletePrompt component.
 */
function DeletePrompt(): ReactElement {
  const { setDisplay } = useDisplay();
  const { customer, setCustomer } = useCustomer();
  const { customers, setCustomers } = useCustomerNames();
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsSubmitting(true);
      const arrayName = getDocumentName(customer?.customerID ?? 0);
      const currentCustomers = await getCustomerDoc(arrayName);
      const customerIndex = currentCustomers.findIndex(
        (cust: Customer) => cust.customerID === customer?.customerID
      );

      if (customerIndex === -1) {
        setError("Customer not found in database");
        return;
      }

      currentCustomers.splice(customerIndex, 1);
      await updateDoc(doc(db, "customers", arrayName), {
        customers: currentCustomers,
        count: currentCustomers.length,
      });

      const updatedCustomers = customers.filter(
        (cust: Customer) => cust.customerID !== customer?.customerID
      );
      setCustomers(updatedCustomers);
      setCustomer(null);
      setDisplay("default");
    } catch (err) {
      setError(
        `Failed to delete customer: ${err instanceof Error ? err.message : "Unknown error"}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setConfirm("");
    setError("");
    setDisplay("default");
  };

  const customerName = customer ? `${customer.firstName} ${customer.lastName}` : "";
  const deleteButtonLabel = isSubmitting ? "Processing..." : "Delete";
  const instructionText = "Type";
  const confirmationText = "To Delete This Customer";

  return (
    <Prompt title="Delete Customer">
      <PromptField error={error}>
        <div className="mb-2 flex w-full items-center justify-center gap-1 text-xs text-gray-200">
          {instructionText}
          <span className="mx-1 rounded bg-red-900/60 px-2 py-0.5 text-white ring-2 ring-rose-800">
            {customerName}
          </span>
          {confirmationText}
        </div>
        <PromptInput
          value={confirm}
          onChange={(ev) => setConfirm(ev.target.value)}
          disabled={isSubmitting}
          placeholder="Enter customer name to confirm"
        />
      </PromptField>
      <div className="flex flex-row justify-end gap-5">
        <PromptButton
          onClick={handleDelete}
          disabled={isSubmitting || !customer || confirm !== customerName}
          label={deleteButtonLabel}
          icon={null}
        />
        <PromptButton onClick={handleCancel} disabled={isSubmitting} label="Cancel" icon={null} />
      </div>
    </Prompt>
  );
}

export default DeletePrompt;
