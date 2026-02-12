/* import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  type?: string;
  placeholder: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ type = "text", ...props }, ref) => {
    return (
      <input
        type={type}
        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
        ref={ref}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";
export default Input;*/

"use client";

import { useState, InputHTMLAttributes, forwardRef } from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  inputTittle?: string;
  labelFor?: string; // TODO: remove this later cuz if redundant as RHF uses 'name'
  icon?: boolean;
  IconChildren?: React.ReactNode;
  passwordVisibility?: boolean;
  error?: string; //New prop for error messages
  focusBorder?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      inputTittle,
      labelFor,
      icon,
      type = "text",
      placeholder,
      IconChildren,
      passwordVisibility = false,
      className,
      error,
      focusBorder = true,
      ...props
    },
    ref,
  ) => {
    // UI State only (Password toggle)
    const [seePassword, setSeePassword] = useState(false);

    return (
      <div className="flex flex-col w-full h-full">
        <div className="flex flex-col gap-0 w-full text-[14px]">
          {/* Label */}
          {inputTittle && (
            <label htmlFor={labelFor} className="p-1 font-medium">
              {inputTittle}
            </label>
          )}

          <div className="relative flex justify-center items-center">
            {/* Icon */}
            {icon && (
              <span className="absolute top-[50%] left-4 translate-y-[-50%]">
                {IconChildren}
              </span>
            )}

            {/* The Actual Input */}
            <input
              ref={ref} // 👈 Attach the Ref here
              id={labelFor}
              type={type === "password" && seePassword ? "text" : type}
              placeholder={placeholder}
              autoComplete="off"
              // Keep your exact styling logic
              className={`${
                !className
                  ? `w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400 transition ${
                      icon ? "pl-11" : "pl-4"
                    } ${
                      error // Check the 'error' prop instead of the store
                        ? "outline-0 border-[1.5px] border-red-500 animate-pulse"
                        : "outline-0"
                    }`
                  : className
              }`}
              {...props}
            />

            {/* Password Toggle Button */}
            {passwordVisibility && (
              <button
                type="button"
                onClick={() => setSeePassword(!seePassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {seePassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            )}
          </div>

          {/* Error Message */}
          {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
        </div>
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
