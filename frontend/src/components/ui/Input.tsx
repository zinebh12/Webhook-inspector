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
          className={`w-full rounded-lg border border-slate-700 bg-[#111c2e] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 hover:border-slate-600 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10`}
        />
        {label === "Password" && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 transition hover:text-deep-forest"
          >
            <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
          </button>
        )}
      </div>
    </div>
  );
};

export default Input;
