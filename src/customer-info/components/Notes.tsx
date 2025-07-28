import CheckIcon from "@mui/icons-material/Check";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { doc, updateDoc } from "firebase/firestore";
import { ReactElement, useCallback, useEffect, useState } from "react";

import cn from "../../components/utils";
import { useCustomer } from "../../context/useContext";
import { db } from "../../firebase";
import { getDocumentName, getCustomerDoc } from "../../prompts/scripts";
import { Customer } from "../../types";

/**
 * Displays and allows editing of the customer's notes field.
 * @returns The Notes component.
 */
function Notes(): ReactElement {
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

  return (
    <div className="relative hidden h-full w-full flex-row items-center justify-center sm:flex">
      <div className="absolute top-1/2 left-2 -translate-y-1/2">
        <EditNoteIcon className="text-white" />
      </div>
      <input
        className={
          cn("base h-full w-full rounded-2xl px-9.5 text-xs text-white",
            "ring-1 ring-gray-900/20 transition-all duration-300",
            submitting ? "bg-yellow-300" : "bg-white/20")
        }
        value={tempNote}
        placeholder={customer?.notes || "add note..."}
        onChange={(ev) => setTempNote(ev.target.value)}
        onKeyDown={(ev) => {
          if (ev.key === "Enter") {
            handleNoteSubmit();
          }
        }}
        disabled={submitting}
        autoComplete="on"
        aria-label={tempNote}
      />
      <button
        className={cn("absolute right-2 flex h-fit items-center justify-center",
          "rounded-full transition-colors duration-150",
          tempNote ?
            "cursor-pointer bg-white/5 text-emerald-400 hover:bg-white/10" :
            "cursor-not-allowed bg-white/5 text-gray-400")}
        type="button"
        onClick={handleNoteSubmit}
        disabled={!tempNote || submitting}
      >
        <CheckIcon
          fontSize="small"
          className={`${tempNote ? "text-emerald-400" : "text-gray-400"}`}
        />
      </button>
    </div>
  );
}

export default Notes;
