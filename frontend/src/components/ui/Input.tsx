import type { InputHTMLAttributes } from "react";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

const Input = ({ label, id, ...props }: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id ?? props.name;
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={inputId} className="text-sm font-medium text-slate-200">
        {label}
      </label>
      <div className="relative">
        <input
          {...props}
          type={
            label === "Password"
              ? showPassword
                ? "text"
                : "password"
              : props.type
          }
          className={`w-full rounded-lg border border-input-border bg-input-background px-4 py-3 text-sm text-input-text placeholder:text-input-placeholder outline-none transition focus:border-input-border-focus`}
        />
        {label === "Password" && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-text-secondary transition hover:text-deep-forest"
          >
            <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
          </button>
        )}
      </div>
    </div>
  );
};

export default Input;
