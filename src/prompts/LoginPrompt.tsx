import KeyIcon from "@mui/icons-material/Key";
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from "@mui/icons-material/Person";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useEffect, useState, useCallback, useMemo } from "react";

import { Prompt, PromptButton, PromptField, PromptInput } from "../components";
import { useDisplay } from "../context/useContext";

/**
 * Displays a login prompt for user authentication.
 * @returns The LoginPrompt component.
 */
function LoginPrompt() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const { setDisplay } = useDisplay();

  const handleSignIn = useCallback(async () => {
    setIsSubmitting(true);
    setError("");
    const auth = getAuth();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setTimeout(() => {
        setDisplay("default");
      }, 500);
    } catch (err) {
      if (err && typeof err === "object" && "message" in err) {
        setError((error as { message?: string }).message || "Login failed.");
      } else {
        setError("Login failed.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [email, password, setDisplay]);

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

  return (
    <Prompt
      title={
        <div className="flex flex-row items-center justify-center gap-2">
          {Header}
          <LockIcon fontSize="small" />
        </div>
      }
    >
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

export default LoginPrompt;
