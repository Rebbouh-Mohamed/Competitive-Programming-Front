import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./PrimaryButton.css";
import runplay from "../../../assets/icons/play/runplay.svg"
import display from "../../../assets/icons/play/display.svg"
import ReactLoading from "react-loading";
import Checked from "../../../assets/icons/checked.svg";
const PrimaryButton = ({
  txt,
  isfull = true,
  isicon = false,
  Checkedicon = false,
  isexternal = false,
  onClick,
  redirectDelay = 1000,
  disabled = true, // Disabled state prop
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const handleClick = (event) => {
    if (disabled) return; // Prevent click if disabled
    event.preventDefault(); // Ensure the form does not submit if this is a form button
    if (onClick) onClick(event); // Trigger custom onClick function
    setIsClicked(true);
    setRedirecting(true);
  };

  useEffect(() => {
    if (redirecting) {
      const timeoutId = setTimeout(() => {
        if (isexternal) {
          window.open(path, "_blank", "noopener,noreferrer");
        } else {
        }
        setIsClicked(false);
        setRedirecting(false);
      }, redirectDelay);

      return () => clearTimeout(timeoutId);
    }
  }, [redirecting, isexternal, redirectDelay]);

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
      style={isfull ? { width: "100%" } : { width: "171px" }}
      aria-label={txt}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseOut={() => setIsPressed(false)} // New event handler to cancel pressed state
      disabled={disabled}
    >
      <span className={buttonTextClasses}>
        {isClicked ? (
          <ReactLoading
            type="spin"
            color="#121212"
            height="24px"
            width="24px"
          />
        ) : (
          <span
            style={{
              position: "relative",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              flex: "1 0 0",
              alignSelf: "stretch",
            }}
          >
            {txt}
            {isicon ? (
              <img
                src={disabled ? display : Checkedicon ? Checked : runplay}
                alt="icon"
              />
            ) : (
              ""
            )}
          </span>
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
  isicon: PropTypes.bool,
  icon: PropTypes.node,
  Checkedicon: PropTypes.node,
  isexternal: PropTypes.bool,
  onClick: PropTypes.func,
  redirectDelay: PropTypes.number,
  disabled: PropTypes.bool,
};

export default PrimaryButton;
