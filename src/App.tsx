// ─ Imports ──────────────────────────────────────────────────────────────────────────────────────
import { ReactElement, useEffect, useState } from "react";

import { useDisplay, useCustomerNames, useTotal } from "./context/useContext";
import CustomerInfo from "./customer-info/CustomerInfo";
import { fetchCustomers } from "./firebase";
import CustomerPrompt from "./prompts/CustomerPrompt";
import DeletePrompt from "./prompts/DeletePrompt";
import EditCustomer from "./prompts/EditCustomer";
import LoginPrompt from "./prompts/LoginPrompt";
import Report from "./prompts/Report";
import { cn } from "./prompts/scripts";
import TransactionPrompt from "./prompts/TransactionPrompt";
import Search from "./search/Search";

/**
 * Main application component. Renders the display grid and the main prompts.
 * It fetches the list of customers and renders it accordingly.
 */
function App(): ReactElement {
  const { setTotal } = useTotal();
  const { display } = useDisplay();
  const { setCustomers } = useCustomerNames();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = () => {
      try {
        const unsubscribe = fetchCustomers(({ customers, total }) => {
          setCustomers(customers);
          setTotal(total);
        });
        return () => unsubscribe();
      } catch (err) {
        setError(`Failed to load data: ${err}`);
      }
    };
    loadData();
  }, []);

  return (
    <>
      <div className={cn("absolute grid h-full w-full grid-cols-[25%_75%] bg-gray-900")}>
        <Search />
        <CustomerInfo />
      </div>
      {display === "user" && <CustomerPrompt />}
      {display === "transaction" && <TransactionPrompt />}
      {display === "report" && <Report />}
      {display === "edit" && <EditCustomer />}
      {display === "delete" && <DeletePrompt />}
      {display === "login" && <LoginPrompt />}
      {error && <div className="error-message">{error}</div>}
    </>
  );
}

// ─ Exports ──────────────────────────────────────────────────────────────────────────────────────
export default App;
