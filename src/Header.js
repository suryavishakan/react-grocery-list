import React from "react";

const Header = ({ title }) => (
  <header>
    <h2>{title}</h2>
  </header>
);

Header.defaultProps = {
  title: "React Crash Course",
};

export default Header;
