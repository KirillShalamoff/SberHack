import React, { useState } from "react";
import styles from "./input.module.css";
import { SvgIcon } from "../SvgIcon/SvgIcon";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: string;
  variant?: "default" | "filled" | "outlined";
  fullWidth?: boolean;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  variant = "default",
  fullWidth = false,
  helperText,
  className = "",
  type = "text",
  disabled,
  required,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const inputType = type === "password" && showPassword ? "text" : type;

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    props.onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    props.onBlur?.(e);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div
      className={`${styles.container} ${fullWidth ? styles.fullWidth : ""} ${className}`}
    >
      {label && (
        <label className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}

      <div
        className={`${styles.inputWrapper} ${styles[variant]} ${error ? styles.error : ""} ${isFocused ? styles.focused : ""} ${disabled ? styles.disabled : ""}`}
      >
        {icon && (
          <div className={styles.iconLeft}>
            <SvgIcon name={icon} width={18} height={18} />
          </div>
        )}

        <input
          type={inputType}
          className={styles.input}
          disabled={disabled}
          required={required}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />

        {type === "password" && (
          <button
            type="button"
            className={styles.passwordToggle}
            onClick={togglePasswordVisibility}
            tabIndex={-1}
          >
            <SvgIcon
              name={showPassword ? "eye-off" : "eye"}
              width={18}
              height={18}
            />
          </button>
        )}

        {props.value && type !== "password" && !error && (
          <div className={styles.iconRight}>
            <SvgIcon
              name="check-circle"
              width={18}
              height={18}
              color="#10B981"
            />
          </div>
        )}
      </div>

      {(error || helperText) && (
        <div
          className={`${styles.message} ${error ? styles.errorMessage : ""}`}
        >
          {error || helperText}
        </div>
      )}
    </div>
  );
};
