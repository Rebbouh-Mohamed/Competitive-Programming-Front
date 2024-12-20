import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate, useLocation } from "react-router-dom";
import "./SecondaryButton.css";
import start from "../../../assets/icons/start.svg";
import ReactLoading from "react-loading";
import SearchChecked from "../../../assets/icons/SearchChecked.svg"

const SecondaryButton = ({
  txt,
  isfull = true,
  to = "",
  isicon = false,
  isexternal = false,
  onClick,
  redirectDelay = 1000,
  disabled = false, // Disabled state prop
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
    "buttonSecondary",
    disabled && "buttonSecondary--disabled",
    isHovered && !disabled && "buttonSecondary--hovered",
    isPressed && !disabled && "buttonSecondary--pressed",
    isClicked && "buttonSecondary--clicked",
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
            color="#ffff"
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
                <img src={SearchChecked}/>
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

SecondaryButton.propTypes = {
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

export default SecondaryButton;
