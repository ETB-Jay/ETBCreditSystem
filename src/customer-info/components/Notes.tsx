import { doc, updateDoc } from "firebase/firestore";
import { ReactElement, useCallback, useEffect, useState } from "react";

import { CheckIcon, EditIcon, ModalInput } from "../../components/index";
import { useCustomer } from "../../context/Context";
import { db } from "../../firebase";
import { getDocumentName, getCustomerDoc, cn } from "../../modals/scripts";
import { Customer } from "../../types";

/** Displays and allows editing of the customer's notes field. */
const Notes = (): ReactElement => {
  const { customer } = useCustomer();
  const [tempNote, setTempNote] = useState<string>(customer?.notes || "");
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleNoteSubmit = useCallback(async () => {
    if (!tempNote || !customer) {
      return;
    }
    setSubmitting(true);
    try {
      const arrayName = getDocumentName(customer.customerID);
      const currentCustomers = await getCustomerDoc(arrayName);
      const updatedCustomers = currentCustomers.map((cus: Customer) =>
        cus.customerID === customer.customerID
          ? {
              ...cus,
              notes: tempNote,
            }
          : cus
      );
      await updateDoc(doc(db, "customers", arrayName), { customers: updatedCustomers });
    } finally {
      setSubmitting(false);
    }
  }, [tempNote, customer]);

  useEffect(() => {
    setTempNote("");
  }, [customer]);

  const checkIconClass = tempNote ? "icon-success" : "icon-muted";

  return (
    <div className="relative flex h-full w-full flex-row items-center justify-center">
      <ModalInput
        icon={<EditIcon className="theme-text" />}
        value={tempNote}
        onChange={(ev) => setTempNote(ev.target.value)}
        onKeyDown={(ev) => {
          if (ev.key === "Enter") {
            handleNoteSubmit();
          }
        }}
        placeholder={customer?.notes || "add note..."}
        disabled={submitting}
        autoComplete="on"
        sideButtons={
          <button
            className={cn(
              "flex h-fit items-center justify-center rounded-full transition-colors duration-150",
              tempNote
                ? "white-overlay icon-success white-overlay-hover cursor-pointer"
                : "white-overlay icon-muted cursor-not-allowed"
            )}
            type="button"
            onClick={handleNoteSubmit}
            disabled={!tempNote || submitting}
          >
            <CheckIcon className={checkIconClass} />
          </button>
        }
      />
    </div>
  );
};

export default Notes;
