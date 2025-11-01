import React from "react";

type ButtonProps = {
  btnTex: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  href?: string;
};

const Button: React.FC<ButtonProps> = ({
  btnTex,
  onClick,
  href,
  className,
}) => {
  return (
    <div onClick={onClick} className={className}>
      {btnTex}
    </div>
  );
};

export default Button;
