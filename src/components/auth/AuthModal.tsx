import { useState } from "react";
import { Modal } from "../Modal";
import { useAuth } from "../../auth/AuthContext";
import { isValidUsername } from "../../auth/username";

type AuthMode = "sign-up" | "log-in";

type AuthModalProps = {
  initialMode: AuthMode;
  onClose: () => void;
};

const TITLES: Record<AuthMode, string> = {
  "sign-up": "Sign Up",
  "log-in": "Log In",
};

export function AuthModal({ initialMode, onClose }: AuthModalProps) {
  const { signUp, signIn } = useAuth();
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const usernameValid = isValidUsername(username);
  const passwordValid = password.length >= 8 && password.length <= 30;
  const canSubmit = usernameValid && passwordValid && !submitting;

  const switchMode = (next: AuthMode) => {
    setMode(next);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);
    setError(null);

    const result =
      mode === "sign-up" ? await signUp(username, password) : await signIn(username, password);

    setSubmitting(false);

    if (result.error) {
      setError(result.error);
    } else {
      onClose();
    }
  };

  return (
    <Modal onClose={onClose}>
      <h2 className="text-lg font-semibold text-slate-100 mb-4">{TITLES[mode]}</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-400"
          />
          <p className="mt-1 text-xs text-slate-500">
            3–15 characters: letters, numbers, underscores, hyphens
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-400"
          />
          <p className="mt-1 text-xs text-slate-500">8–30 characters</p>
        </div>

        <div>
          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-indigo-500 cursor-pointer"
          >
            {submitting ? "Please wait…" : TITLES[mode]}
          </button>
          {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
        </div>
      </form>

      <p className="mt-4 text-sm text-slate-400">
        {mode === "sign-up" ? (
          <>
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => switchMode("log-in")}
              className="text-indigo-400 hover:text-indigo-300 cursor-pointer"
            >
              Log in
            </button>
          </>
        ) : (
          <>
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => switchMode("sign-up")}
              className="text-indigo-400 hover:text-indigo-300 cursor-pointer"
            >
              Sign up
            </button>
          </>
        )}
      </p>
    </Modal>
  );
}
