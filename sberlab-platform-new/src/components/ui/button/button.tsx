import type { FunctionComponent, ButtonHTMLAttributes, ReactNode } from "react";

import { To, Link } from "react-router-dom";

import s from "./button.module.css";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "activeGray";
  to?: To;
}

const Button: FunctionComponent<ButtonProps> = ({
  className,
  onClick,
  type = "button",
  children,
  variant = "primary",
  to,
  ...rest
}) => {
  const buttonContent = <>{children}</>;

  const commonProps = {
    className: `${s.button} ${s[`button-${variant}`]}  ${className || ""}`,
    onClick,
    ...rest,
  };

  if (to) {
    return (
      <Link to={to} {...(commonProps as any)}>
        {buttonContent}
      </Link>
    );
  }

  return (
    <button type={type} {...commonProps}>
      {buttonContent}
    </button>
  );
};

export default Button;
