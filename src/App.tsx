import { type ReactElement, useEffect, useState, useCallback, type ChangeEvent, lazy, Suspense } from "react";

import { useDisplay, useCustomerNames, useTotal } from "./context/Context";
import CustomerModal from "./credit/modals/CustomerModal";
import DeleteModal from "./credit/modals/DeleteModal";
import EditCustomerModal from "./credit/modals/EditCustomerModal";
import LoginModal from "./credit/modals/LoginModal";
import ReportModal from "./credit/modals/ReportModal";
import TransactionModal from "./credit/modals/TransactionModal";
import { fetchCustomers, accountLogService } from "./firebase";

// Lazy load the main components to reduce initial bundle size
const Account = lazy(() => import("./account/Account"));
const Credit = lazy(() => import("./credit/Credit"));

// Loading component for lazy-loaded modules
const LoadingSpinner = () => (
  <div className="flex h-full w-full items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
  </div>
);

/**
 * Main application component. Renders the display grid and the main modals.
 * It fetches the list of customers and renders it accordingly.
 */
const App = (): ReactElement => {
  const { setTotal } = useTotal();
  const { display } = useDisplay();
  const { setCustomers } = useCustomerNames();
  const [error, setError] = useState<string | null>(null);
  const [currentTheme, setCurrentTheme] = useState<"credit" | "account">(() => {
    const savedTheme = localStorage.getItem("currentTheme");
    return savedTheme === "credit" || savedTheme === "account" ? savedTheme : "account";
  });

  const themeOptions = [
    { value: "credit", label: "Credit" },
    { value: "account", label: "Account" },
  ] as const;

  const handleThemeChange = useCallback(async (theme: "credit" | "account") => {
    setCurrentTheme(theme);
    localStorage.setItem("currentTheme", theme);
    document.documentElement.setAttribute("data-theme", theme);

    // Run cleanup when switching to account section
    if (theme === "account") {
      try {
        console.log("Running cleanup when switching to account theme...");
        await accountLogService.cleanupZeroColumns();
        console.log("Theme switch cleanup completed");
      } catch (cleanupError) {
        console.warn("Failed to cleanup zero columns:", cleanupError);
        // Don't show error to user as this is a background cleanup operation
      }
    }
  }, []);

  const handleSelectChange = useCallback(
    (ev: ChangeEvent<HTMLSelectElement>) => {
      handleThemeChange(ev.target.value as "credit" | "account");
    },
    [handleThemeChange]
  );

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
        setError(`Failed to load data: ${err instanceof Error ? err.message : String(err)}`);
      }
    };
    loadData();
  }, []); // Add empty dependency array to run only once

  // Run cleanup on app initialization if starting with account theme
  useEffect(() => {
    if (currentTheme === "account") {
      const runInitialCleanup = async () => {
        try {
          console.log("Running initial cleanup for account theme...");

          // Debug: Check if sep-2025 document exists
          await accountLogService.debugMonthlyDocument("sep-2025");

          await accountLogService.cleanupZeroColumns();
          console.log("Initial cleanup completed");
        } catch (cleanupError) {
          console.warn("Failed to cleanup zero columns on app load:", cleanupError);
          // Don't show error to user as this is a background cleanup operation
        }
      };
      void runInitialCleanup();
    }
  }, []); // Run only once on app load

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
        className="theme-bg theme-border theme-text w-fit rounded border px-2 text-xs"
        value={currentTheme}
        onChange={handleSelectChange}
      >
        {themeOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {currentTheme === "credit" && (
        <Suspense fallback={<LoadingSpinner />}>
          <Credit />
        </Suspense>
      )}
      {currentTheme === "account" && (
        <Suspense fallback={<LoadingSpinner />}>
          <Account />
        </Suspense>
      )}
      {display !== "default" && renderModalContent()}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default App;
