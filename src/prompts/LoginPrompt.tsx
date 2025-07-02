import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { Prompt, PromptButton, PromptField, PromptInput } from '../components';
import { useEffect, useState, useCallback } from 'react';
import { useDisplay } from '../context/useContext';
import LockIcon from '@mui/icons-material/Lock';

/**
 * Displays a login prompt for user authentication.
 * @returns The LoginPrompt component.
 */
function LoginPrompt() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const { setDisplay } = useDisplay();

    const handleSignIn = useCallback(async () => {
        setIsSubmitting(true);
        setError('');
        const auth = getAuth();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            setTimeout(() => {
                setDisplay('default');
            }, 500);
        } catch (error: unknown) {
            if (error && typeof error === 'object' && 'message' in error) {
                setError((error as { message?: string }).message || 'Login failed.');
            } else {
                setError('Login failed.');
            }
        } finally {
            setIsSubmitting(false);
        }
    }, [email, password, setDisplay]);

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Enter') handleSignIn();
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [handleSignIn]);

    return (
        <Prompt title={
            <div className="flex flex-row gap-2 items-center justify-center">
                Login
                <LockIcon fontSize="small" />
            </div>
        }>
            <div className="flex flex-col items-center w-full gap-4 py-2">
                <PromptField error={error}>
                    <PromptInput
                        label={'Email'}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        type="email"
                        disabled={isSubmitting}
                    />
                </PromptField>
                <PromptField>
                    <PromptInput
                        type="password"
                        label={'Password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        disabled={isSubmitting}
                    />
                </PromptField>
                <PromptButton
                    onClick={handleSignIn}
                    disabled={isSubmitting}
                    label={isSubmitting ? 'Loading...' : 'Login'}
                    icon={null}
                />
            </div>
        </Prompt>
    );
}

export default LoginPrompt;
