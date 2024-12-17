import React, { useEffect, useState } from "react";
import Xicon from "../../assets/icons/Xicon.svg";
import "./stylegreen.css"; // Make sure to import the CSS file

const ToastGreen = ({
  message = "Game is about to begin! Get ready to dive in!",
  onClose,
  position = { top: "50px", right: "50px" },
  speed = 0.1,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [positionOffset, setPositionOffset] = useState(100); // Start off-screen

  useEffect(() => {
    if (message) {
      setIsVisible(true); // Show the toast
      setPositionOffset(100); // Reset position to off-screen

      // Slide in effect
      const slideIn = setInterval(() => {
        setPositionOffset((prev) => {
          if (prev > 0) {
            return prev - 100 / (speed * 60); // Gradually move towards 0
          } else {
            clearInterval(slideIn); // Stop sliding in
            return 0;
          }
        });
      }, 16); // ~60fps

      // Start slide out after 5 seconds
      const timer = setTimeout(() => {
        handleClose();
      }, 5000);

      // Cleanup timers and intervals
      return () => {
        clearTimeout(timer);
        clearInterval(slideIn);
      };
    }
  }, [message, onClose, speed]);

  // Function to handle the slide-out effect
  const handleClose = () => {
    const slideOut = setInterval(() => {
      setPositionOffset((prev) => {
        if (prev < 100) {
          return prev + 100 / (speed * 60); // Gradually move towards 100
        } else {
          clearInterval(slideOut); // Stop sliding out
          setIsVisible(false); // Hide the toast
          onClose(); // Trigger onClose callback
          return 100;
        }
      });
    }, 16);
  };

  if (!isVisible) return null; // Only show the toast if it is visible

  return (
    <div
      className="toast-container"
      onClick={handleClose} // Trigger slide-out on click
      style={{
        top: position.top,
        right: position.right,
        bottom: position.bottom,
        left: position.left,
        transform: `translateX(${positionOffset}%)`, // Adjust position dynamically
        transition: `transform ${speed}s ease-out`, // Smooth sliding animation
      }}
    >
      <div className="header">
        <div className="header-text">Success</div>
        <div className="icon-container">
          <img src={Xicon} className="close-icon" alt="Close icon" />
        </div>
      </div>
      <div className="message-container">
        <div className="message-text">{message}</div>
      </div>
    </div>
  );
};

export default ToastGreen;
