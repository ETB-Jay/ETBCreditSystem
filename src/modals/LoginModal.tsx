import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useEffect, useState, useCallback, useMemo, ReactElement } from "react";

import { cn } from "./scripts";
import Modal from "../components/containers/Modal";
import { ArrowDropDownIcon, KeyIcon, LockIcon, PersonIcon } from "../components/index";
import ModalButton from "../components/ui/ModalButton";
import ModalField from "../components/ui/ModalField";
import ModalInput from "../components/ui/ModalInput";
import { useDisplay } from "../context/Context";

interface AutofillProps {
  email: string;
  password: string;
}

const NO_SAVED_LOGINS = "no saved logins";

interface AutofillDropdownProps {
  autofill: AutofillProps[];
  showAutofill: boolean;
  isSubmitting: boolean;
  onSelect: (entry: AutofillProps) => void;
}

const AutofillDropdown = ({
  autofill,
  showAutofill,
  isSubmitting,
  onSelect,
}: AutofillDropdownProps) => {
  if (!showAutofill || isSubmitting) {
    return null;
  }

  const content =
    autofill.length > 0 ? (
      <>
        {autofill.map((autofillContent) => (
          <div
            key={autofillContent.email}
            className="autofill-bg autofill-hover cursor-pointer p-1 transition-all"
            onClick={() => onSelect(autofillContent)}
            onKeyDown={(ev) => {
              if (ev.key === "Enter") {
                onSelect(autofillContent);
              }
            }}
          >
            {autofillContent.email}
          </div>
        ))}
      </>
    ) : (
      <div className="white-text px-2 py-2 text-nowrap">{NO_SAVED_LOGINS}</div>
    );

  return (
    <div
      className={cn(
        "autofill-bg absolute top-full right-0 z-50 flex flex-col",
        "autofill-border white-text rounded-sm border-2 text-xs shadow-md shadow-black"
      )}
    >
      {content}
    </div>
  );
};

/** Displays a login modal for user authentication. */
const LoginModal = (): ReactElement => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [autofill, setAutoFill] = useState<AutofillProps[]>([]);
  const [showAutofill, setShowAutofill] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const { setDisplay } = useDisplay();

  useEffect(() => {
    const pastInput = localStorage.getItem("autofill");
    if (pastInput) {
      const parsed = JSON.parse(pastInput);
      setAutoFill(parsed);
    }
  }, []);

  const handleSignIn = useCallback(
    async (overrideEmail?: string, overridePassword?: string) => {
      setShowAutofill(false);
      setIsSubmitting(true);
      setError("");
      const auth = getAuth();
      const usedEmail = overrideEmail ?? email;
      const usedPassword = overridePassword ?? password;
      try {
        await signInWithEmailAndPassword(auth, usedEmail, usedPassword);

        if (!autofill.some((auto) => auto.email === usedEmail)) {
          const newAutofill = [...autofill, { email: usedEmail, password: usedPassword }];
          setAutoFill(newAutofill);
          localStorage.setItem("autofill", JSON.stringify(newAutofill));
        }

        setTimeout(() => {
          setDisplay("default");
        }, 500);
      } catch (err) {
        if (err && typeof err === "object" && "message" in err) {
          setError((err as { message?: string }).message || "Login failed.");
        } else {
          setError("Login failed.");
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [email, password, setDisplay, autofill]
  );

  useEffect(() => {
    const onKeyDown = (ev: KeyboardEvent) => {
      if (ev.key === "Enter") {
        handleSignIn();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleSignIn]);

  const submitLabel = useMemo(() => (isSubmitting ? "Loading..." : "Login"), [isSubmitting]);

  const handleAutofillSelect = useCallback(
    (entry: AutofillProps) => {
      setEmail(entry.email);
      setPassword(entry.password);
      setShowAutofill(false);
      handleSignIn(entry.email, entry.password);
    },
    [handleSignIn]
  );

  return (
    <Modal title="Login" icon={<LockIcon sx={{ width: 16, height: 16 }} />} closeable={false}>
      <div
        className="gray-text-dark absolute top-4 right-5 cursor-pointer"
        onMouseEnter={() => setShowAutofill(true)}
        onMouseLeave={() => setShowAutofill(false)}
        style={{ display: "inline-block" }}
      >
        <ArrowDropDownIcon className="hover:brightness-75" />
        <AutofillDropdown
          autofill={autofill}
          showAutofill={showAutofill}
          isSubmitting={isSubmitting}
          onSelect={handleAutofillSelect}
        />
      </div>
      <form
        className="flex w-full flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          handleSignIn();
        }}
      >
        <ModalField error={error}>
          <ModalInput
            icon={<PersonIcon sx={{ width: 20, height: 20 }} />}
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
            placeholder="Enter your email"
            type="email"
            disabled={isSubmitting}
          />
        </ModalField>
        <ModalField>
          <ModalInput
            icon={<KeyIcon sx={{ width: 20, height: 20 }} />}
            type="password"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
            placeholder="Enter your password"
            disabled={isSubmitting}
          />
        </ModalField>
        <ModalButton disabled={isSubmitting} label={submitLabel} icon={null} type="submit" />
      </form>
    </Modal>
  );
};

export default LoginModal;
