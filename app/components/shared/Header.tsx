import React from "react";

interface Props {
  title: string;
  subtitle?: string;
}

const Header = ({ title, subtitle }: Props) => {
  return (
    <>
      <h2 className="h2-bold dark-600">{title}</h2>
      {subtitle && <p className="font-normal p-16-regular mt-5">{subtitle}</p>}
    </>
  );
};

export default Header;
