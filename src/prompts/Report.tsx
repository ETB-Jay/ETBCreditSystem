// ─ Imports ──────────────────────────────────────────────────────────────────────────────────────
import DownloadIcon from "@mui/icons-material/Download";
import { collection, onSnapshot } from "firebase/firestore";
import JSZip from "jszip";
import { useCallback, useEffect, useState } from "react";

import { GithubIcon, Prompt, PromptButton, PromptField } from "../components";
import { useDisplay, useCustomerNames, useTotal } from "../context/useContext";
import { db } from "../firebase";
import { Transaction } from "../types";

// ─ Interfaces ───────────────────────────────────────────────────────────────────────────────────
interface TransactionWithCustomer extends Transaction {
  customerID: number;
};

// ─ Constants ───────────────────────────────────────────────────────────────────────────────────
const REPORT_LABELS = {
  NumberCustomer: "Number of Customers: ",
  TotalCredit: "Total Credit: ",
  Outstanding: "Number of Outstanding Individuals:"
}

/**
 * Displays a system information report
 * Allows downloading customer and transaction data as CSV files.
 */
function Report() {
  const { customers } = useCustomerNames();
  const { setDisplay } = useDisplay();
  const { total } = useTotal();
  const [outstanding, setOutstanding] = useState<number>(0);
  const [totalCredit, setTotalCredit] = useState<string>("0");
  const [allTransactions, setAllTransactions] = useState<TransactionWithCustomer[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "customers"), (snapshot) => {

      const transactions: TransactionWithCustomer[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (!data.customers || !Array.isArray(data.customers)) { return []; }

        data.customers.forEach((customer) => {
          if (!customer.transactions || !Array.isArray(customer.transactions)) { return [] };
          customer.transactions.forEach((transaction: Transaction) => {
            transactions.push({
              ...transaction,
              customerID: customer.customerID,
            });
          })
        });
      });

      setAllTransactions(transactions);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const negativeBalanceCustomers = customers.filter((customer) => Number(customer.balance) < 0);
    setOutstanding(negativeBalanceCustomers.length);

    const total = customers.reduce((sum, customer) => sum + Number(customer.balance), 0);
    setTotalCredit(total.toLocaleString("en-CA", { style: "currency", currency: "CAD" }));
  }, [customers]);

  const dateInstance = useCallback((transaction: Transaction) =>
    transaction.date instanceof Date
      ? transaction.date.toLocaleString()
      : "", [])

  const handleDownload = async () => {
    try {
      const zip = new JSZip();
      const date = new Date().toISOString().split("T")[0].replace(",", ";");

      const customerHeaders = [
        "customerID",
        "firstName",
        "lastName",
        "email",
        "phone",
        "balance",
        "notes",
      ];
      const customerCsvContent = [
        customerHeaders.join(","),
        ...customers
          .sort((customerA, customerB) => customerA.customerID - customerB.customerID)
          .map((customer) =>
            [
              customer.customerID || "",
              customer.firstName || "",
              customer.lastName || "",
              customer.email || "",
              customer.phone || "",
              customer.balance || 0,
              customer.notes || "",
            ].join(",")
          ),
      ].join("\n");

      const transactionHeaders = [
        "customerID",
        "date",
        "changeBalance",
        "employeeName",
        "notes"
      ];
      const transactionCsvContent = [
        transactionHeaders.join(","),
        ...allTransactions.map((transaction) =>
          [
            transaction.customerID || "",
            (typeof transaction.date === "object" && "seconds" in transaction.date
              ? new Date(transaction.date.seconds * 1000).toLocaleString().replace(",", " ")
              : dateInstance(transaction)),
            transaction.changeBalance || 0,
            transaction.employeeName || "",
            (transaction.notes || "").replace(/,/g, ""),
          ].join(",")
        ),
      ].join("\n");

      zip.file("customers.csv", customerCsvContent);
      zip.file("transactions.csv", transactionCsvContent);

      const content = await zip.generateAsync({ type: "blob" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(content);

      link.setAttribute("href", url);
      link.setAttribute("download", `etb_credit_report_${date}.zip`);
      link.style.visibility = "hidden";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      // eslint-disable-next-line no-alert
      alert(`There was an error generating the download. Please try again. ${err}`);
    }
  };

  return (
    <Prompt title="SYSTEM INFORMATION">
      <div className="absolute block top-3 right-3">
        <GithubIcon />
      </div>
      <PromptField>
        <p className="rounded-2xl bg-white/5 p-3 font-bold text-white">
          {REPORT_LABELS.NumberCustomer}<span className="ml-1 font-semibold">{total}</span>
        </p>
      </PromptField>
      <PromptField>
        <p className="rounded-2xl bg-white/5 p-3 font-bold text-white">
          {REPORT_LABELS.TotalCredit}<span className="ml-1 font-semibold">{totalCredit}</span>
        </p>
      </PromptField>
      <PromptField>
        <p className="rounded-2xl bg-white/5 p-3 font-semibold text-white">
          {REPORT_LABELS.Outstanding}<span className="ml-1 font-semibold">{outstanding}</span>
        </p>
      </PromptField>
      <div className="flex flex-row gap-x-2">
        <PromptButton
          onClick={() => setDisplay("default")}
          label="Close"
          disabled={false}
          icon={null}
        />
        <PromptButton
          onClick={handleDownload}
          icon={<DownloadIcon fontSize="small" />}
          label="Download"
          disabled={false}
        />
      </div>
    </Prompt>
  );
}

// ─ Exports ──────────────────────────────────────────────────────────────────────────────────────
export default Report;
