// ─ Imports ──────────────────────────────────────────────────────────────────────────────────────
import DownloadIcon from "@mui/icons-material/Download";
import { collection, onSnapshot } from "firebase/firestore";
import JSZip from "jszip";
import { useEffect, useState } from "react";

import { Prompt, PromptButton, PromptField } from "../components";
import { useDisplay, useCustomerNames, useTotal } from "../context/useContext";
import { db } from "../firebase";
import { Transaction } from "../types";

// ─ Interfaces ───────────────────────────────────────────────────────────────────────────────────
type TransactionWithCustomer = Transaction & {
  customerID: number;
  firstName: string;
  lastName: string;
};

// ─ Constants ────────────────────────────────────────────────────────────────────────────────────
const GithubLink = "https://github.com/ETB-Jay/ETBCreditSystem";

/**
 * Displays a system information report
 * Allows downloading customer and transaction data as CSV files.
 * @returns The Report component.
 */
function Report() {
  const { customers } = useCustomerNames();
  const { setDisplay } = useDisplay();
  const [outstanding, setOutstanding] = useState(0);
  const [totalCredit, setTotalCredit] = useState("0");
  const [allTransactions, setAllTransactions] = useState<TransactionWithCustomer[]>([]);
  const { total } = useTotal();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "customers"), (snapshot) => {
      const transactions: TransactionWithCustomer[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.customers && Array.isArray(data.customers)) {
          data.customers.forEach((customer) => {
            if (customer.transactions && Array.isArray(customer.transactions)) {
              customer.transactions.forEach((transaction: Transaction) => {
                transactions.push({
                  ...transaction,
                  customerID: customer.customer_id,
                  firstName: customer.first_name,
                  lastName: customer.last_name,
                });
              });
            }
          });
        }
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

  const dateInstance = (transaction: Transaction) =>
    transaction.date instanceof Date
      ? transaction.date.toLocaleString()
      : ""

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

      const transactionHeaders = ["customerID", "date", "changeBalance", "employeeName", "notes"];
      const transactionCsvContent = [
        transactionHeaders.join(","),
        ...allTransactions.map((transaction) =>
          [
            transaction.customerID || "",
            typeof transaction.date === "object" &&
              "seconds" in transaction.date
              ? new Date(transaction.date.seconds * 1000).toLocaleString()
              : dateInstance(transaction),
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

  const reportLabels = {
    NumberCustomer: "Number of Customers: ",
    TotalCredit: "Total Credit: ",
    Outstanding: "Number of Outstanding Individuals:"
  }

  return (
    <Prompt title="SYSTEM INFORMATION">
      <div className="absolute top-4 right-4">
        <a href={GithubLink}>
          <img
            className="h-6 cursor-pointer transition-all hover:brightness-50 active:brightness-75"
            draggable="false"
            src="githubLogo.png"
            alt={GithubLink}
          />
        </a>
      </div>
      <PromptField>
        <p className="rounded-2xl bg-white/5 p-3 font-bold text-white">
          {reportLabels.NumberCustomer}<span className="ml-1 font-semibold">{total}</span>
        </p>
      </PromptField>
      <PromptField>
        <p className="rounded-2xl bg-white/5 p-3 font-bold text-white">
          {reportLabels.TotalCredit}<span className="ml-1 font-semibold">{totalCredit}</span>
        </p>
      </PromptField>
      <PromptField>
        <p className="rounded-2xl bg-white/5 p-3 font-semibold text-white">
          {reportLabels.Outstanding}<span className="ml-1 font-semibold">{outstanding}</span>
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
