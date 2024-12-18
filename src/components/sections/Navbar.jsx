// Navbar.jsx
import React, { useState } from "react";
import avatar from "../../assets/images/avatar.svg";
import logo from "../../assets/images/logo.svg"
import DangerButton from "../ui-elements/buttons/DangerButton";
import { USERNAME } from "../../context/constant";
const Navbar = () => {
  const container = {
    display: "flex",
    width: "90rem",
    padding: "2rem 4rem",
    justifyContent: "space-between",
    alignItems: "center",
  };
  const buttons = {
    display: "flex",
    alignItems: "center",
    gap: "1.5rem",
  };
  const leftbutton = {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  };
  const usernamestyle = {
    color: "var(--White, #FFF)",
    textAlign: "center",
    fontFamily: "Inter",
    fontSize: "1rem",
    fontStyle: "normal",
    fontWeight: "500",
    lineHeight: "1.5rem",
    listStyle: "none"
  };
  const logoutstyle = {
    display: "flex",
    padding: "0.5rem 0.75rem",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
  };

  return (
    <div style={container}>
      <img
        src={logo}
        alt="logo_logo"
        style={{
          width: "3.66938rem",
          height: "3rem",
          flexShrink: "0",
        }}
      />

      <ul style={buttons}>
        <ul style={leftbutton}>
          <img
            src={avatar}
            alt="Avatar_icon"
            style={{
              width: "1.5rem",
              height: "1.5rem",
            }}
          />
          <li style={usernamestyle}>{localStorage.getItem(USERNAME)}</li>
        </ul>
        <DangerButton txt="Logout" isLogout={true} />
      </ul>
    </div>
  );
};

export default Navbar;
