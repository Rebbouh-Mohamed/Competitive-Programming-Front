import React, { useState } from "react";
import showedeye from "../../../assets/icons/eye/showedeye.svg";
import hiddeneye from "../../../assets/icons/eye/hiddeneye.svg";
const styles = {
  input: (isFocused) => ({
    flex: "1 0 0",
    width: "100%",
    padding: "0.75rem 1rem",
    background: isFocused ? "transparent" : "var(--Medium-Gray, #414141)",
    borderRadius: "1rem",
    border: isFocused ? "transparent" : "none", // Focused border color
    outline: isFocused ? "2px solid var(--White, #FFF)" : "none", // Focused border color
    fontFamily: "Inter",
    fontSize: "16px",
    fontWeight: "700",
    color: "var(--Neutral-gray-400, #FFFFFF)",
    "::placeholder": { color: "#929292" },
  }),
  button: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
  },
  svg: {
    display: "flex",
    padding: "0.25rem",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    gap: "var(--sm, 8px)",
    alignSelf: "stretch",
    borderRadius: "1rem",
    transition: "border-color 0.3s ease",
  },
};
const Inputbar = ({
  placeholder,
  isPassword,
  value,
  onChange,
  showAsEntered,
}) => {
  const [showPassword, setShowPassword] = useState(false); // Track visibility of the password
  const [inputValue, setInputValue] = useState(value || ""); // Store the current input value
  const [fullInputValue, setFullInputValue] = useState(""); // Store the accumulated value
  const [isFocused, setIsFocused] = useState(false); // Track focus state
  // Handle changes in the input field
  const handleChange = (e) => {
    // Check if e.target exists to avoid the error
    if (!e.target) return;
  
    const input = e.target.value;
    const newValue =
      input.length < fullInputValue.length
        ? input
        : fullInputValue + input.slice(fullInputValue.length);
  
    setInputValue(input);
    setFullInputValue(newValue);
    onChange(newValue);
  };
  
  const handleFocus = () => {
    setIsFocused(true); // Set focused state to true
  };
  const handleBlur = () => {
    setIsFocused(false); // Set focused state to false
  };
  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); // Toggle the visibility between show and hide
  };

  // Get either the password as text or as masked dots based on the visibility
  const getMaskedValue = () => {
    if (showPassword && showAsEntered) {
      return fullInputValue; // Show accumulated input when showing password
    } else if (!showPassword) {
      return "•".repeat(fullInputValue.length); // Show dots if the password is hidden
    }
    return fullInputValue; // Default to showing the accumulated input value
  };
  return (
    <>
      <style>
        {`
          input::placeholder {
            color: var(--Light-Gray, #929292);
            font-family: Inter;
            font-size: 1rem;
            font-style: normal;
            font-weight: 500;
            line-height: 1.5rem;
          }
        `}
      </style>
      <input
        type="text" // Always use text for custom masking (no native password dots)
        placeholder={placeholder}
        value={isPassword ? getMaskedValue() : fullInputValue} // Show either the actual password or the dots based on visibility
        onChange={handleChange} // Handle the input changes
        onFocus={handleFocus} // Handle focus event
        style={styles.input(isFocused)} // Pass focused state to style
        onBlur={handleBlur} // Handle blur event
      />
      {isPassword && (
        <button
          onClick={togglePasswordVisibility} // Toggle show/hide password
          style={styles.button}
          onFocus={handleFocus}
          onBlur={handleBlur}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {fullInputValue ? (
            showPassword ? (
              <img style={styles.svg} src={showedeye} />
            ) : (
              <img style={styles.svg} src={hiddeneye} />
            )
          ) : (
            ""
          )}
          {/* Show/hide icon */}
        </button>
      )}
    </>
  );
};

const InputField = ({
  placeholder,
  isPassword,
  value,
  onChange,
  showAsEntered,
}) => (
  <div style={styles.container}>
    <Inputbar
      placeholder={placeholder}
      isPassword={isPassword}
      value={value}
      onChange={onChange}
      showAsEntered={showAsEntered} // Pass down the new prop
    />
  </div>
);

export default InputField;
