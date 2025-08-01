// ─ Imports ──────────────────────────────────────────────────────────────────────────────────────
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import KeyIcon from "@mui/icons-material/Key";
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from "@mui/icons-material/Person";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useEffect, useState, useCallback, useMemo } from "react";

import { Prompt, PromptButton, PromptField, PromptInput } from "../components";
import { cn } from "./scripts";
import { useDisplay } from "../context/useContext";


// ─ Interfaces ────────────────────────────────────────────────────────────────────────────────────
interface AutofillProps {
  email: string,
  password: string,
}

// ─ Constants ────────────────────────────────────────────────────────────────────────────────────
const NO_SAVED_LOGINS = "no saved logins"

/** Displays a login prompt for user authentication. */
function LoginPrompt() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [autofill, setAutoFill] = useState<AutofillProps[]>([]);
  const [showAutofill, setShowAutofill] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const { setDisplay } = useDisplay();

  useEffect(() => {
    const pastInput = localStorage.getItem("autofill")
    if (pastInput) {
      const parsed = JSON.parse(pastInput);
      setAutoFill(parsed)
    }
  }, [])

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

        if (!autofill.some(auto => auto.email === usedEmail)) {
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

  const Header = "Login";
  const submitLabel = useMemo(() => isSubmitting ? "Loading..." : "Login", [isSubmitting])

  const handleAutofillSelect = (entry: AutofillProps) => {
    setEmail(entry.email);
    setPassword(entry.password);
    setShowAutofill(false);
    handleSignIn(entry.email, entry.password);
  };

  const AutofillDropdown = useMemo(() => {
    if (!showAutofill || isSubmitting) { return null; }

    const content =
      autofill.length > 0 ?
        <>
          {
            autofill.map((autofillContent) =>
              <div
                key={autofillContent.email}
                className="cursor-pointer bg-gray-800 hover:bg-gray-600/80 p-1 transition-all"
                onClick={() => handleAutofillSelect(autofillContent)}
                onKeyDown={(ev) => {
                  if (ev.key === "Enter") { handleAutofillSelect(autofillContent) }
                }}
              >
                {autofillContent.email}
              </div>
            )
          }
        </>
        :
        <div className="text-white px-2 py-2 text-nowrap">
          {NO_SAVED_LOGINS}
        </div>

    return (
      <div
        className={cn("absolute flex flex-col top-full right-0 z-50 bg-gray-800",
          "border-2 border-gray-950 shadow-black shadow-md rounded-sm text-white text-xs")}
      >
        {content}
      </div>
    )
  }, [showAutofill, autofill, isSubmitting]);

  return (
    <Prompt
      title={
        <div className="flex flex-row items-center justify-center gap-2">
          {Header}
          <LockIcon fontSize="small" />
        </div>
      }
    >
      <div
        className="absolute top-2 right-5 text-gray-700 cursor-pointer"
        onMouseEnter={() => setShowAutofill(true)}
        onMouseLeave={() => setShowAutofill(false)}
        style={{ display: "inline-block" }}
      >
        <ArrowDropDownIcon className='hover:brightness-75' />
        {/* Dropdown is now a child of the hoverable div */}
        {AutofillDropdown}
      </div>
      <form className="flex w-full flex-col items-center gap-2 py-2">
        <PromptField error={error}>
          <PromptInput
            icon={<PersonIcon fontSize="small" />}
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
            placeholder="Enter your email"
            type="email"
            disabled={isSubmitting}
          />
        </PromptField>
        <PromptField>
          <PromptInput
            icon={<KeyIcon fontSize="small" />}
            type="password"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
            placeholder="Enter your password"
            disabled={isSubmitting}
          />
        </PromptField>
        <PromptButton
          onClick={handleSignIn}
          disabled={isSubmitting}
          label={submitLabel}
          icon={null}
        />
      </form>
    </Prompt>
  );
}

// ─ Exports ──────────────────────────────────────────────────────────────────────────────────────
export default LoginPrompt;
