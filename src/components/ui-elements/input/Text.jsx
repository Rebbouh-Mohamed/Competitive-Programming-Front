import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate, useLocation } from "react-router-dom";
import "./PrimaryButton.css";
import start from "../../../assets/start.svg"
import ReactLoading from "react-loading";

const PrimaryButton = ({
  txt,
  isfull = true,
  to = "",
  isicon = true,
  isexternal = false,
  onClick,
  redirectDelay = 1000,
  disabled = true, // Disabled state prop
  icon = "▶️", // Default icon if `isicon` is true
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const path = to || location.pathname;
  const fullPath = path.startsWith("/") ? path : `/${path}`;

  const handleClick = (event) => {
    if (disabled) return; // Prevent click if disabled
    event.preventDefault();
    if (onClick) onClick(event);
    setIsClicked(true);
    setRedirecting(true);
  };

  useEffect(() => {
    if (redirecting) {
      const timeoutId = setTimeout(() => {
        if (isexternal) {
          window.open(path, "_blank", "noopener,noreferrer");
        } else {
          navigate(fullPath);
        }
        setIsClicked(false);
        setRedirecting(false);
      }, redirectDelay);

      return () => clearTimeout(timeoutId);
    }
  }, [redirecting, navigate, path, fullPath, isexternal, redirectDelay]);

  const buttonClasses = [
    "button",
    disabled && "button--disabled",
    isHovered && !disabled && "button--hovered",
    isPressed && !disabled && "button--pressed",
    isClicked && "button--clicked",
  ]
    .filter(Boolean)
    .join(" ");

  const buttonTextClasses = ["buttonText", isClicked && "buttonText--clicked"]
    .filter(Boolean)
    .join(" ");

  const buttonContent = (
    <button
      className={buttonClasses}
      style={isfull ? { width: "100%" } : { width: "auto" }}
      aria-label={txt}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      disabled={disabled}
    >
      <span className={buttonTextClasses}>
        {isClicked ? (
          <ReactLoading
            type="spin"
            color="#000000"
            height="20px"
            width="20px"
          />
        ) : (
          <>
            {txt}
            {isicon && start}
          </>
        )}
      </span>
    </button>
  );

  return (
    <div className={`linkWrapper ${isfull ? "full-width" : ""}`}>
      {buttonContent}
    </div>
  );
};

PrimaryButton.propTypes = {
  txt: PropTypes.string.isRequired,
  isfull: PropTypes.bool,
  to: PropTypes.string,
  isicon: PropTypes.bool,
  icon: PropTypes.node,
  isexternal: PropTypes.bool,
  onClick: PropTypes.func,
  redirectDelay: PropTypes.number,
  disabled: PropTypes.bool,
};

export default PrimaryButton;
