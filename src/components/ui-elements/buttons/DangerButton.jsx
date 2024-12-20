import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { logoutUser } from "../../../../redux/logout/action";

const DangerButton = ({
  txt,
  isfull = true,
  to = "",
  isicon = false,
  isexternal = false,
  redirectDelay = 1000,
  isLogout = false, // New prop to determine if it's a logout button
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const path = to || location.pathname;
  const fullPath = path.startsWith("/") ? path : `/${path}`;

  useEffect(() => {
    if (!redirecting) return;

    const timeoutId = setTimeout(() => {
      if (isLogout) {
        dispatch(logoutUser());
        navigate("/login");
      } else if (isexternal) {
        window.open(fullPath, "_blank", "noopener,noreferrer");
      } else {
        navigate(fullPath);
      }
      setRedirecting(false);
    }, redirectDelay);

    return () => clearTimeout(timeoutId);
  }, [redirecting, navigate, fullPath, isexternal, redirectDelay, dispatch, isLogout]);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsPressed(false);
  };
  const handleMouseDown = () => setIsPressed(true);
  const handleMouseUp = () => setIsPressed(false);
  const buttonStyle = {
    backgroundColor: isPressed
      ? "rgba(255, 255, 255, 0.24)"
      : isHovered
      ? "rgba(255, 255, 255, 0.12)"
      : "transparent",
    color: "var(--Red, #FF453A)",
    border: "1px solid var(--Red, #FF453A)",
    display: "flex",
    padding: "0.5rem 0.75rem",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
    fontFamily: "Inter",
    fontSize: "1rem",
    fontStyle: "normal",
    fontWeight: "500",
    lineHeight: "1.5rem",
    borderRadius: "3.125rem",
    cursor: "pointer",
    transition: "background-color 0.2s ease, color 0.2s ease",
    width: isfull ? "100%" : "auto",
  };

  return (
    <button
      style={buttonStyle}
      aria-label={txt}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onClick={() => setRedirecting(true)}
    >
      {txt}
    </button>
  );
};

DangerButton.propTypes = {
  txt: PropTypes.string.isRequired,
  isfull: PropTypes.bool,
  to: PropTypes.string,
  isicon: PropTypes.bool,
  isexternal: PropTypes.bool,
  redirectDelay: PropTypes.number,
  isLogout: PropTypes.bool,
};

export default DangerButton;
