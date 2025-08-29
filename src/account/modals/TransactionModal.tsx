import { useState, useEffect, type ChangeEvent } from "react";

import {
  Modal,
  ModalField,
  ModalInput,
  ModalButtonGroup,
  CashIcon,
  AddCardIcon,
} from "../../components";

import type { Column } from "../../types";

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  columns: Column[];
}

const TransactionModal = ({ isOpen, onClose, columns }: TransactionModalProps) => {
  const [cash, setCash] = useState<number>(0);
  const [credit, setCredit] = useState<number[]>(() => Array(columns.length).fill(0));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Ensure credit state matches columns length; initialize to zeros if sizes differ
    setCredit((prev) => (prev.length === columns.length ? prev : Array(columns.length).fill(0)));
  }, [columns.length]);

  if (!isOpen) {
    return null;
  }

  const handleCashChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value) || 0;
    setCash(value);
  };

  const handleCreditChange = (idx: number) => (event: ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value) || 0;
    setCredit((prev) => {
      const newCredit = [...prev];
      newCredit[idx] = value;
      return newCredit;
    });
  };

  const handleSubmit = () => {
    if (isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      handleCancel();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create transaction");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setCash(0);
    setCredit(Array(columns.length).fill(0));
    setError(null);
    onClose();
  };

  const submitLabel = isLoading ? "Processing..." : "Confirm";
  const cashValue = cash === 0 ? "" : cash.toString();

  return (
    <Modal title="Add Transaction" handleClose={handleCancel} isLoading={isLoading}>
      <form
        className="flex w-full flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          handleSubmit();
        }}
      >
        <ModalField>
          <ModalInput
            icon={<CashIcon />}
            type="number"
            value={cashValue}
            onChange={handleCashChange}
            placeholder="Enter cash amount"
            step={0.01}
            disabled={isLoading}
          />
        </ModalField>

        {credit.map((amount, idx) => {
          const creditValue = amount === 0 ? "" : amount.toString();
          const creditPlaceholder = `Enter credit ${idx + 1} amount`;

          return (
            <ModalField key={`credit-field-${idx + 1}-${amount}`}>
              <ModalInput
                icon={<AddCardIcon />}
                type="number"
                value={creditValue}
                onChange={handleCreditChange(idx)}
                placeholder={creditPlaceholder}
                step={0.01}
                disabled={isLoading}
              />
            </ModalField>
          );
        })}

        {error && (
          <ModalField error={error}>
            <div className="h-0" />
          </ModalField>
        )}

        <ModalButtonGroup
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          submitLabel={submitLabel}
          isSubmitting={isLoading}
        />
      </form>
    </Modal>
  );
};

export default TransactionModal;
