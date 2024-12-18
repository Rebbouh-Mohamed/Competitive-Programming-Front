import React, { useState, forwardRef } from "react";
import showedeye from "../../../assets/icons/eye/showedeye.svg";
import hiddeneye from "../../../assets/icons/eye/hiddeneye.svg";

const styles = {
  input: (isFocused) => ({
    flex: "1 0 0",
    width: "100%",
    padding: "0.75rem 1rem",
    background: isFocused ? "transparent" : "var(--Medium-Gray, #414141)",
    borderRadius: "1rem",
    border: isFocused ? "transparent" : "none",
    outline: isFocused ? "2px solid var(--White, #FFF)" : "none",
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

const Inputbar = forwardRef(({ placeholder, isPassword, value, onChange, showAsEntered }, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const [inputValue, setInputValue] = useState(value || "");
  const [fullInputValue, setFullInputValue] = useState(value || "");
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e) => {
    if (!e.target) return;
    const { value: input, selectionStart } = e.target;
    setFullInputValue(input);
    setInputValue(input);
    onChange(input);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };
  const handleBlur = () => {
    setIsFocused(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const getMaskedValue = () => {
    if (showPassword && showAsEntered) {
      return fullInputValue;
    } else if (!showPassword) {
      return "\u2022".repeat(fullInputValue.length);
    }
    return fullInputValue;
  };

  const handleKeyDown = (e) => {
    if (isPassword && e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      // Prevent default typing behavior if password field
      e.preventDefault();

      const { selectionStart, selectionEnd } = e.target;
      const newChar = e.key;
      const newValue =
        fullInputValue.slice(0, selectionStart) +
        newChar +
        fullInputValue.slice(selectionEnd);

      setFullInputValue(newValue);
      onChange(newValue);

      // Update cursor position manually
      setTimeout(() => {
        e.target.setSelectionRange(selectionStart + 1, selectionStart + 1);
      });
    } else if (e.key === "Backspace" || e.key === "Delete") {
      e.preventDefault();

      const { selectionStart, selectionEnd } = e.target;
      let newValue;
      if (selectionStart === selectionEnd) {
        // Single cursor
        if (e.key === "Backspace" && selectionStart > 0) {
          newValue =
            fullInputValue.slice(0, selectionStart - 1) +
            fullInputValue.slice(selectionEnd);
          setTimeout(() => {
            e.target.setSelectionRange(selectionStart - 1, selectionStart - 1);
          });
        } else if (e.key === "Delete" && selectionStart < fullInputValue.length) {
          newValue =
            fullInputValue.slice(0, selectionStart) +
            fullInputValue.slice(selectionEnd + 1);
          setTimeout(() => {
            e.target.setSelectionRange(selectionStart, selectionStart);
          });
        } else {
          newValue = fullInputValue;
        }
      } else {
        // Range delete
        newValue =
          fullInputValue.slice(0, selectionStart) +
          fullInputValue.slice(selectionEnd);
        setTimeout(() => {
          e.target.setSelectionRange(selectionStart, selectionStart);
        });
      }

      setFullInputValue(newValue);
      onChange(newValue);
    }
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
        ref={ref} // Attach the ref to the input element
        type="text"
        placeholder={placeholder}
        value={isPassword ? getMaskedValue() : fullInputValue}
        onChange={handleChange}
        onFocus={handleFocus}
        style={styles.input(isFocused)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
      />
      {isPassword && (
        <button
          onClick={togglePasswordVisibility}
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
        </button>
      )}
    </>
  );
});

const InputField = forwardRef(({ placeholder, isPassword, value, onChange, showAsEntered }, ref) => (
  <div style={styles.container}>
    <Inputbar
      ref={ref} // Forward the ref to Inputbar
      placeholder={placeholder}
      isPassword={isPassword}
      value={value}
      onChange={onChange}
      showAsEntered={showAsEntered}
    />
  </div>
));

export default InputField;
