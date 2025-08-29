import { Timestamp, updateDoc, doc } from "firebase/firestore";
import React, { type ReactElement, useState, useEffect, useCallback, type FormEvent } from "react";

import {
  Modal,
  ModalField,
  ModalInput,
  CashIcon,
  AddIcon,
  RemoveIcon,
  ClearIcon,
  ArrowDropDownIcon,
  DeleteIcon,
  ModalButtonGroup,
} from "../../components";
import { useCustomer, useDisplay } from "../../context/Context";
import { db } from "../../firebase";

import { getDocumentName, getCustomerDoc, cn } from "./scripts";

import type { Customer } from "../../types";

const LABELS = {
  CURRENT: "Current:",
  NEW: "New:",
  EMPLOYEE_NAME: "Employee Name",
  NO_EMPLOYEES: "No employees",
  ADD_NEW_EMPLOYEE: "Add New Employee",
  SELECT_EMPLOYEE: "Select employee",
};

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
 * A modal that allows the user to add a new transaction to the system.
 * It appears only when the state is 'transaction'.
 */
const TransactionModal = (): ReactElement => {
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

  const handlePaymentType = useCallback((type: "add" | "sub") => {
    setPayment({ add: type === "add", sub: type === "sub" });
  }, []);

  const updateTransaction = useCallback(async () => {
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
  }, [isSubmitting, newTransaction, payment, customer, setCustomer]);

  const handleSubmit = useCallback(async () => {
    const valid = await updateTransaction();
    if (valid) {
      setDisplay("default");
    }
  }, [updateTransaction, setDisplay]);

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

  const submitLabel = isSubmitting ? "Processing..." : "Confirm";

  return (
    <Modal title="New Transaction">
      <form
        className="flex flex-col gap-4"
        onSubmit={useCallback(
          (ev: FormEvent) => {
            ev.preventDefault();
            void handleSubmit();
          },
          [handleSubmit]
        )}
      >
        <ModalField error={errors.invalidValue}>
          <div className="mb-1 ml-auto flex flex-row gap-3">
            <span
              className={cn(
                "gray-border gray-bg-medium rounded border px-2 py-1",
                "gray-text-light font-mono text-xs"
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
                  "rounded border px-2 py-1 font-mono text-xs transition-colors",
                  payment.add && "btn-success",
                  payment.sub && "btn-danger"
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
          <ModalInput
            icon={<CashIcon sx={{ width: 20, height: 20 }} />}
            placeholder="Amount"
            type="text"
            value={newTransaction.changeBalance}
            onChange={useCallback((input) => {
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
              setNewTransaction((prev) => ({
                ...prev,
                changeBalance: value,
              }));
            }, [])}
            disabled={isSubmitting}
            sideButtons={
              <>
                <SideButton
                  label={<AddIcon sx={{ width: 15, height: 15 }} />}
                  color={cn("white-text btn-success", payment.add && "btn-success-active")}
                  onClick={useCallback(() => handlePaymentType("add"), [handlePaymentType])}
                />
                <SideButton
                  label={<RemoveIcon sx={{ width: 15, height: 15 }} />}
                  color={cn(
                    "white-text btn-danger",
                    payment.sub ? "btn-danger-active" : "btn-danger-inactive btn-danger-hover"
                  )}
                  onClick={useCallback(() => handlePaymentType("sub"), [handlePaymentType])}
                />
              </>
            }
          />
        </ModalField>

        <ModalField error={errors.noEmployee}>
          <div className="theme-text flex w-full flex-row items-center gap-2">
            {(() => {
              if (showAddEmployee) {
                return (
                  <div className="flex w-full flex-row items-center gap-2">
                    <ModalInput
                      placeholder="New Name"
                      value={newEmployeeName}
                      onChange={(ev) => setNewEmployeeName(ev.target.value)}
                      disabled={isSubmitting}
                    />
                    <SideButton
                      color="btn-success"
                      label={<AddIcon sx={{ width: 20, height: 20 }} />}
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
                      color="gray-button gray-button-hover gray-ring"
                      label={<ClearIcon sx={{ width: 20, height: 20 }} />}
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
                <div className="relative flex flex-1 flex-row items-center justify-center gap-2">
                  <div className="relative w-full">
                    <button
                      type="button"
                      className={cn(
                        "flex h-7 w-full items-center justify-between rounded-md border",
                        "theme-input-border theme-input-bg px-2 text-xs placeholder-gray-500",
                        "gray-hover gray-focus cursor-pointer transition-colors outline-none",
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
                          "theme-border overflow-y-auto rounded border",
                          "theme-panel shadow-lg"
                        )}
                      >
                        {employees.length === 0 && (
                          <div className="theme-muted px-3 py-2 text-xs">{LABELS.NO_EMPLOYEES}</div>
                        )}
                        {employees.map((employee) => {
                          const isSelected = employee === newTransaction.employeeName;
                          const employeeClass = cn(
                            "cursor-pointer px-3 py-2 text-xs transition-all gray-hover",
                            isSelected && "theme-panel font-bold"
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
                            "theme-text gray-hover"
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
                      label={<DeleteIcon sx={{ width: 20, height: 20 }} />}
                      color="danger-button danger-button-hover danger-ring"
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
        </ModalField>

        <ModalField>
          <ModalInput
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
        </ModalField>

        <ModalButtonGroup
          onSubmit={handleSubmit}
          onCancel={() => setDisplay("default")}
          submitLabel={submitLabel}
          isSubmitting={isSubmitting}
        />
      </form>
    </Modal>
  );
};

export default TransactionModal;
