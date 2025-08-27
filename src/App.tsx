import { ReactElement, useEffect, useState, useCallback, ChangeEvent } from "react";

import { useDisplay, useCustomerNames, useTotal } from "./context/Context";
import CustomerInfo from "./customer-info/CustomerInfo";
import { fetchCustomers } from "./firebase";
import CustomerModal from "./modals/CustomerModal";
import DeleteModal from "./modals/DeleteModal";
import EditCustomerModal from "./modals/EditCustomerModal";
import LoginModal from "./modals/LoginModal";
import ReportModal from "./modals/ReportModal";
import { cn } from "./modals/scripts";
import TransactionModal from "./modals/TransactionModal";
import Search from "./search/Search";

/**
 * Main application component. Renders the display grid and the main modals.
 * It fetches the list of customers and renders it accordingly.
 */
const App = (): ReactElement => {
  const { setTotal } = useTotal();
  const { display } = useDisplay();
  const { setCustomers } = useCustomerNames();
  const [error, setError] = useState<string | null>(null);
  const [currentTheme, setCurrentTheme] = useState<"credit" | "account">("credit");

  const handleThemeChange = useCallback((theme: "credit" | "account") => {
    setCurrentTheme(theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", currentTheme);
  }, [currentTheme]);

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

  const renderModalContent = useCallback(() => {
    switch (display) {
      case "user":
        return <CustomerModal />;
      case "transaction":
        return <TransactionModal />;
      case "report":
        return <ReportModal />;
      case "edit":
        return <EditCustomerModal />;
      case "delete":
        return <DeleteModal />;
      case "login":
        return <LoginModal />;
      default:
        return null;
    }
  }, [display]);

  return (
    <div className="theme-bg flex h-screen w-full flex-col gap-3 overflow-hidden p-3">
      <select
        className="theme-bg theme-border theme-text w-fit rounded border px-2 text-sm"
        value={currentTheme}
        onChange={useCallback(
          (ev: ChangeEvent<HTMLSelectElement>) =>
            handleThemeChange(ev.target.value as "credit" | "account"),
          [handleThemeChange]
        )}
      >
        <option value="credit">Credit</option>
        <option value="account">Account</option>
      </select>
      {currentTheme === "credit" && (
        <div className={cn("grid flex-1 grid-cols-[min(30%,200px)_1fr] gap-3 overflow-hidden")}>
          <Search />
          <CustomerInfo />
        </div>
      )}
      {display !== "default" && renderModalContent()}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default App;
