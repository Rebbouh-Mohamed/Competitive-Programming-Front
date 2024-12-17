import React, { useState, useEffect ,useCallback} from "react";
import ReactLoading from "react-loading";
import PrimaryButton from "../ui-elements/buttons/PrimaryButton"; // Importing a reusable primary button component
import SecondaryButton from "../ui-elements/buttons/SecondaryButton"; // Importing a reusable secondary button component
import greencheck from "../../assets/icons/greencheck.svg"; // Importing the green check icon
import warning from "../../assets/icons/warning.svg"; // Importing the warning icon
import error from "../../assets/icons/error.svg"; // Importing the error icon

// Importing handleCompile function


function Thebuttons({ func }) {
  const [isTested, setIsTested] = useState(true);

  const ButtonsStyle = {
    display: "flex",
    width: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: "16px",
  };

  // Handler to run func and update state
  const handleTestClick = useCallback((stat) => {
    func(stat);           // Run the provided function
    setIsTested(false); // Update state to trigger re-render
  }, [func]);

  return (
    <div style={ButtonsStyle}>
      <SecondaryButton
        txt="Test"
        to="game-round"
        isfull={false}
        type="submit"
        isicon
        onClick={()=>handleTestClick(true)} // Runs the handler
      />

      <PrimaryButton
        txt="Submit"
        to="game-round"
        type="submit"
        isfull={false}
        isicon
        disabled={isTested} // Renders differently if tested
        onClick={()=>handleTestClick(false)} // Runs the handler

      />
    </div>
  );
}


// Component for displaying accuracy with a corresponding icon and text

function Accuracy({ value }) {
  // Inline styling for the accuracy container
  const AccuracyStyle = {
    display: "flex", // Arrange icon and text in a horizontal row
    gap: "8px", // Add space between icon and text
    alignItems: "center", // Vertically align items to the center
    width: "100%", // Set container to full width
  };

  // Function to return dynamic text styles based on accuracy value
  const TextStyle = (value, isChecking) => ({
    color: isChecking
      ? "#929292" // Grey color during loading
      : value >= 80
      ? "var(--Green, #32D74B)" // Green color for high accuracy
      : value >= 40
      ? "var(--Yellow, #FFD60A)" // Yellow color for medium accuracy
      : "var(--Red, #FF3B30)", // Red color for low accuracy
    fontFamily: "Inter", // Set the font
    fontSize: "14px", // Set the font size
    fontWeight: "400", // Set the font weight
    lineHeight: "20px", // Set the line height
  });

  // Initial state for feedback message and icon
  const [feedbackMessage, setFeedbackMessage] = useState(
    "Checking your solution… Please wait."
  );
  const [feedbackIcon, setFeedbackIcon] = useState(null);

  // Function to determine feedback based on accuracy value
  const getFeedback = (value) => {
    if (value >= 80) {
      return {
        message: "Accuracy: ",
        color: "#32D74B",
        icon: greencheck,
      };
    } else if (value >= 50) {
      return {
        message: "Accuracy: ",
        color: "#FFD60A",
        icon: warning,
      };
    } else {
      return {
        message: "Accuracy: ",
        color: "#FF453A",
        icon: error,
      };
    }
  };

  // Effect to simulate loading delay
  useEffect(() => {
    const { message, icon } = getFeedback(value);

    const timeoutId = setTimeout(() => {
      setFeedbackMessage(message);
      setFeedbackIcon(icon);
    }, 3000); // 3-second delay

    return () => clearTimeout(timeoutId); // Cleanup on unmount
  }, [value]);

  // Check if we are in the "loading" state
  const isChecking = feedbackMessage === "Checking your solution… Please wait.";

  return (
    <div style={AccuracyStyle}>
      {isChecking ? (
        <ReactLoading type="spin" color="#929292" height="24px" width="24px" />
      ) : (
        <img src={feedbackIcon} alt="Accuracy icon" />
      )}
      <p style={TextStyle(value, isChecking)}>
        {feedbackMessage}
        {!isChecking && `${value}%`}
      </p>
    </div>
  );
}

// Component for rendering the entire Push section
function Push({ value = 101, func }) {
  // Inline styling for the Push container
  const PushStyles = {
    display: "flex", // Arrange child components in a horizontal row
    width: "90rem", // Set the container width
    justifyContent: "space-between", // Space out child components evenly
    alignItems: "center", // Vertically align items to the center
  };

  return (
    <div style={PushStyles}>
      {/* Render the Accuracy component and pass the value as a prop */}
      <Accuracy value={value} />
      {/* Render the Thebuttons component */}
      <Thebuttons func={func} />
    </div>
  );
}

export default Push; // Export the Push component as default
