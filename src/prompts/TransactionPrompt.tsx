// ─ Imports ──────────────────────────────────────────────────────────────────────────────────────
import AddIcon from "@mui/icons-material/Add";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveIcon from "@mui/icons-material/Remove";
import { doc, updateDoc, Timestamp } from "firebase/firestore";
import { useState, useEffect, ReactElement } from "react";

import { Prompt, PromptButton, PromptField, PromptInput } from "../components";
import { useDisplay, useCustomer } from "../context/useContext";
import { db } from "../firebase";
import { Customer } from "../types";
import { cn, getDocumentName, getCustomerDoc  } from "./scripts";

// ─ Constants ────────────────────────────────────────────────────────────────────────────────────
const LABELS = {
  CURRENT: "Current:",
  NEW: "New:",
  EMPLOYEE_NAME: "Employee Name",
  NO_EMPLOYEES: "No employees",
  ADD_NEW_EMPLOYEE: "Add New Employee",
  SELECT_EMPLOYEE: "Select employee",
};


// ─ Interfaces ───────────────────────────────────────────────────────────────────────────────────
interface TransactionInput {
  changeBalance: string;
  employeeName: string;
  notes: string;
}
interface SideButtonProps {
  label: ReactElement;
  color: string;
  onClick: () => void;
  disabled?: boolean;
  title?: string;
}


/**
 * A prompt that allows the user to add a new transaction to the system.
 * It appears only when the state is 'transaction'.
 */
function TransactionPrompt(): ReactElement {
  const { customer, setCustomer } = useCustomer();
  const transactionTemplate: TransactionInput = {
    changeBalance: "",
    employeeName: "",
    notes: "",
  };
  const [newTransaction, setNewTransaction] = useState<TransactionInput>(transactionTemplate);
  const { setDisplay } = useDisplay();
  const [errors, setErrors] = useState({
    invalidValue: "",
    noEmployee: "",
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [payment, setPayment] = useState({ add: false, sub: false });
  const [employees, setEmployees] = useState<string[]>([]);
  const [showAddEmployee, setShowAddEmployee] = useState<boolean>(false);
  const [newEmployeeName, setNewEmployeeName] = useState<string>("");
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  useEffect(() => {
    const stored = localStorage.getItem("employees");
    setEmployees(stored ? JSON.parse(stored) : []);
  }, []);

  const handlePaymentType = (type: "add" | "sub") => {
    setPayment({ add: type === "add", sub: type === "sub" });
  };

  const updateTransaction = async () => {
    if (isSubmitting) {
      return false;
    }
    setIsSubmitting(true);
    setErrors({ invalidValue: "", noEmployee: "" });
    try {
      const delta = newTransaction.changeBalance;
      if (!delta || !/^\d*(\.\d{1,2})?$/.test(delta)) {
        const errorMessage = delta
          ? "Amount Must Have a Valid Number of Decimal Places!"
          : "Amount is Required and Must be a Valid Number!";
        setErrors((previousErrors) => ({
          ...previousErrors,
          invalidValue: errorMessage,
        }));
        return false;
      }
      if (!payment.add && !payment.sub) {
        setErrors((previousErrors) => ({
          ...previousErrors,
          invalidValue: "Please Indicate Transaction Type!",
        }));
        return false;
      }
      if (!newTransaction.employeeName.trim()) {
        setErrors((previousErrors) => ({
          ...previousErrors,
          noEmployee: "Please Enter Your Name!",
        }));
        return false;
      }
      const signedDelta = payment.sub ? -Number(delta) : Number(delta);
      const transactionData = {
        employeeName: newTransaction.employeeName.trim(),
        changeBalance: signedDelta,
        notes: newTransaction.notes.trim() || "",
        date: Timestamp.now(),
      };
      if (!customer) {
        throw new Error("Customer data is not properly loaded");
      }
      const arrayName = getDocumentName(customer.customerID);
      const currentCustomers = await getCustomerDoc(arrayName);
      const updatedCustomers = currentCustomers.map((customerItem: Customer) =>
        customerItem.customerID === customer.customerID
          ? {
              ...customerItem,
              transactions: [...customerItem.transactions, transactionData],
              balance:
                Math.round(
                  (Number(customerItem.balance) + Number(transactionData.changeBalance)) * 100
                ) / 100,
            }
          : customerItem
      );
      await updateDoc(doc(db, "customers", arrayName), {
        customers: updatedCustomers,
      });
      const updatedCustomer = updatedCustomers.find(
        (customerItem: Customer) => customerItem.customerID === customer.customerID
      );
      if (updatedCustomer) {
        setCustomer(updatedCustomer);
      }
      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message || "An unexpected error occurred during the transaction"
          : "An unexpected error occurred during the transaction";

      setErrors((previousErrors) => ({
        ...previousErrors,
        invalidValue: errorMessage,
      }));
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    const valid = await updateTransaction();
    if (valid) {
      setDisplay("default");
    }
  };

  const SideButton = ({ label, color, onClick, disabled = false, title = "" }: SideButtonProps) => {
    const buttonClass = cn(
      "flex items-center justify-center rounded-full p-0.5 ring-2 transition-all",
      disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
      color
    );

    return (
      <button
        className={buttonClass}
        onClick={onClick}
        disabled={disabled}
        title={title}
        type="button"
      >
        {label}
      </button>
    );
  };

  return (
    <Prompt title="New Transaction">
      <PromptField error={errors.invalidValue}>
        <div className="ml-auto flex flex-row gap-3">
          <span
            className={cn(
              "rounded border border-gray-700 bg-gray-800 px-2 py-1",
              "font-mono text-xs text-gray-200"
            )}
          >
            {LABELS.CURRENT}{" "}
            <span className="font-bold">
              {Number(customer?.balance).toLocaleString("en-CA", {
                style: "currency",
                currency: "CAD",
              })}
            </span>
          </span>
          {(payment.add || payment.sub) && (
            <span
              className={cn(
                "rounded px-2 py-1 font-mono text-xs ring-2 transition-all",
                payment.add && "bg-emerald-700/30 ring-emerald-950",
                payment.sub && "bg-red-800/30 ring-red-950"
              )}
            >
              {LABELS.NEW}{" "}
              <span className="font-bold">
                {(
                  Number(customer?.balance) +
                  (payment.sub
                    ? -Number(newTransaction.changeBalance)
                    : Number(newTransaction.changeBalance))
                ).toLocaleString("en-CA", {
                  style: "currency",
                  currency: "CAD",
                })}
              </span>
            </span>
          )}
        </div>
        <PromptInput
          icon={<AttachMoneyIcon fontSize="small" />}
          placeholder="Amount"
          type="text"
          step="0.01"
          value={newTransaction.changeBalance}
          onChange={(input) => {
            let value = input.target.value;
            value = value.replace(/[^0-9.]/g, "");
            const parts = value.split(".");
            if (parts.length > 2) {
              value = `${parts[0]}.${parts.slice(1).join("")}`;
            }
            if (value.includes(".")) {
              const [intPart, decPart] = value.split(".");
              value = `${intPart}.${decPart.slice(0, 2)}`;
            }
            setNewTransaction({
              ...newTransaction,
              changeBalance: value,
            });
          }}
          disabled={isSubmitting}
          sideButtons={
            <>
              <SideButton
                label={<AddIcon fontSize="small" />}
                color={cn(
                  "text-white ring-emerald-950",
                  payment.add
                    ? "bg-emerald-800"
                    : "bg-emerald-700/30 hover:bg-emerald-800/60 active:bg-emerald-900"
                )}
                onClick={() => handlePaymentType("add")}
              />
              <SideButton
                label={<RemoveIcon fontSize="small" />}
                color={cn(
                  "text-white ring-red-950",
                  payment.sub ? "bg-red-900" : "bg-red-800/30 hover:bg-red-900/60 active:bg-red-950"
                )}
                onClick={() => handlePaymentType("sub")}
              />
            </>
          }
        />
      </PromptField>

      <PromptField error={errors.noEmployee}>
        <div className="flex w-full flex-row items-center gap-2">
          {(() => {
            if (showAddEmployee) {
              return (
                <div className="flex w-full flex-row items-center gap-2">
                  <PromptInput
                    placeholder="New Name"
                    value={newEmployeeName}
                    onChange={(ev) => setNewEmployeeName(ev.target.value)}
                    disabled={isSubmitting}
                  />
                  <SideButton
                    color="bg-emerald-700 hover:bg-emerald-800 ring-emerald-900"
                    label={<AddIcon fontSize="small" />}
                    onClick={() => {
                      const trimmed = newEmployeeName.trim();
                      if (trimmed && !employees.includes(trimmed)) {
                        const updated = [...employees, trimmed];
                        setEmployees(updated);
                        localStorage.setItem("employees", JSON.stringify(updated));
                        setNewTransaction({
                          ...newTransaction,
                          employeeName: trimmed,
                        });
                        setShowAddEmployee(false);
                        setNewEmployeeName("");
                      }
                    }}
                    disabled={
                      newEmployeeName.trim() === "" || employees.includes(newEmployeeName.trim())
                    }
                    title="Add employee"
                  />
                  <SideButton
                    color="bg-gray-600 hover:bg-gray-900 ring-gray-950/50"
                    label={<ClearIcon fontSize="small" />}
                    onClick={() => {
                      setShowAddEmployee(false);
                      setNewEmployeeName("");
                    }}
                    title="Cancel"
                  />
                </div>
              );
            }
            return (
              <div className="relative flex flex-1 flex-row items-center justify-center gap-1">
                <div className="relative w-full">
                  <button
                    type="button"
                    className={cn(
                      "flex h-7 w-full items-center justify-between rounded-md border",
                      "border-gray-700 bg-gray-800 px-2 py-0.5 text-sm placeholder-gray-500",
                      "transition-colors outline-none hover:bg-gray-700 focus:bg-gray-500",
                      isSubmitting && "cursor-not-allowed opacity-50"
                    )}
                    onClick={() => {
                      if (!isSubmitting) {
                        setShowDropdown((previous) => !previous);
                      }
                    }}
                    onKeyDown={(ev) => {
                      if ((ev.key === "Enter" || ev.key === " ") && !isSubmitting) {
                        setShowDropdown((previous) => !previous);
                      }
                    }}
                    disabled={isSubmitting}
                  >
                    {newTransaction.employeeName || LABELS.SELECT_EMPLOYEE}
                    <span className="ml-2">
                      <ArrowDropDownIcon />
                    </span>
                  </button>
                  {showDropdown && !isSubmitting && (
                    <div
                      className={cn(
                        "container-snap absolute z-50 mt-1 max-h-30 w-full",
                        "overflow-y-scroll rounded border border-gray-700",
                        "bg-gray-800 shadow-lg"
                      )}
                    >
                      {employees.length === 0 && (
                        <div className="px-3 py-2 text-xs text-gray-400">{LABELS.NO_EMPLOYEES}</div>
                      )}
                      {employees.map((employee) => {
                        const isSelected = (employee === newTransaction.employeeName);
                        const employeeClass = cn(
                          "cursor-pointer px-3 py-2 text-xs transition-all hover:bg-gray-700",
                          isSelected && "bg-gray-700 font-bold"
                        );

                        return (
                          <div
                            key={employee}
                            className={employeeClass}
                            onClick={() => {
                              setNewTransaction({
                                ...newTransaction,
                                employeeName: employee,
                              });
                              setShowDropdown(false);
                            }}
                            onKeyDown={(ev) => {
                              if (ev.key === "Enter" || ev.key === " ") {
                                setNewTransaction({
                                  ...newTransaction,
                                  employeeName: employee,
                                });
                                setShowDropdown(false);
                              }
                            }}
                            role="button"
                            tabIndex={0}
                          >
                            {employee}
                          </div>
                        );
                      })}
                      <div
                        className={cn(
                          "cursor-pointer px-3 py-2 text-xs font-semibold",
                          "text-red-200 hover:bg-gray-700"
                        )}
                        onClick={() => {
                          setShowAddEmployee(true);
                          setShowDropdown(false);
                        }}
                        onKeyDown={(ev) => {
                          if (ev.key === "Enter" || ev.key === " ") {
                            setShowAddEmployee(true);
                            setShowDropdown(false);
                          }
                        }}
                        role="button"
                        tabIndex={0}
                      >
                        {LABELS.ADD_NEW_EMPLOYEE}
                      </div>
                    </div>
                  )}
                </div>
                {newTransaction.employeeName && (
                  <SideButton
                    label={<DeleteIcon fontSize="small" />}
                    color="bg-red-800 hover:bg-red-900 active:bg-red-950 ring-red-900 ml-1"
                    onClick={() => {
                      const updated = employees.filter(
                        (employeeItem) => employeeItem !== newTransaction.employeeName
                      );
                      setEmployees(updated);
                      localStorage.setItem("employees", JSON.stringify(updated));
                      setNewTransaction({
                        ...newTransaction,
                        employeeName: "",
                      });
                    }}
                    disabled={isSubmitting}
                    title={`Delete ${newTransaction.employeeName}`}
                  />
                )}
              </div>
            );
          })()}
        </div>
      </PromptField>

      <PromptField>
        <PromptInput
          value={newTransaction.notes}
          onChange={(input) =>
            setNewTransaction({
              ...newTransaction,
              notes: input.target.value,
            })
          }
          disabled={isSubmitting}
          placeholder="Notes..."
        />
      </PromptField>

      <div className="mt-4 flex flex-row justify-end gap-5">
        {(() => {
          const submitLabel = isSubmitting ? "Processing..." : "Confirm";
          return (
            <>
              <PromptButton
                onClick={handleSubmit}
                disabled={isSubmitting}
                label={submitLabel}
                icon={null}
              />
              <PromptButton
                onClick={() => setDisplay("default")}
                label="Cancel"
                disabled={isSubmitting}
                icon={null}
              />
            </>
          );
        })()}
      </div>
    </Prompt>
  );
}

// ─ Exports ──────────────────────────────────────────────────────────────────────────────────────
export default TransactionPrompt;
