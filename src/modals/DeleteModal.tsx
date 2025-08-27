import { doc, updateDoc } from "firebase/firestore";
import { useState, ReactElement } from "react";

import Modal from "../components/containers/Modal";
import ModalButtonGroup from "../components/ui/ModalButtonGroup";
import ModalField from "../components/ui/ModalField";
import ModalInput from "../components/ui/ModalInput";
import { useDisplay, useCustomer, useCustomerNames } from "../context/Context";
import { db } from "../firebase";
import { getDocumentName, getCustomerDoc } from "./scripts";
import { Customer } from "../types";

/** Displays a modal for confirming and deleting a customer. */
const DeleteModal = (): ReactElement => {
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
    <Modal title="Delete Customer">
      <form
        className="flex w-full flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          handleDelete();
        }}
      >
        <ModalField error={error}>
          <div className="gray-text-light mb-4 flex w-full items-center justify-center gap-1 text-xs">
            {instructionText}
            <span className="danger-bg-dark white-text danger-ring mx-1 rounded px-2 py-0.5 ring-2">
              {customerName}
            </span>
            {confirmationText}
          </div>
          <ModalInput
            value={confirm}
            onChange={(ev) => setConfirm(ev.target.value)}
            disabled={isSubmitting}
            placeholder="Enter customer name to confirm"
          />
        </ModalField>
        <ModalButtonGroup
          onSubmit={handleDelete}
          onCancel={handleCancel}
          submitLabel={deleteButtonLabel}
          submitDisabled={!customer || confirm !== customerName}
          isSubmitting={isSubmitting}
        />
      </form>
    </Modal>
  );
};

export default DeleteModal;
