import React from "react";

type ButtonProps = {
  btnTex?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  href?: string;
  className?: string;
  children?: React.ReactNode;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  btnTex,
  onClick,
  href,
  className = "",
  children,
  type = "button",
  disabled = false,
  ...props
}, ref) => {
  const buttonClasses = `inline-flex items-center justify-center ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`;

  if (href) {
    return (
      <a
        href={href}
        className={buttonClasses}
        onClick={onClick as React.MouseEventHandler<HTMLAnchorElement>}
        {...props as any}
      >
        {children || btnTex}
      </a>
    );
  }

 
  return (
    <button
      type={type}
      onClick={onClick}
      className={buttonClasses}
      disabled={disabled}
      ref={ref}
      {...props}
    >
      {children || btnTex}
    </button>
  );
});

Button.displayName = "Button";

export default Button;
