import React, { useState } from "react";
import Select, { components } from "react-select";
import { languageOptions } from "../constants/languageOptions";
import dropdown from "../../../../assets/icons/dropdown.svg";
import expand from "../../../../assets/icons/expand.svg";
import collapse from "../../../../assets/icons/collapse.svg";
import redo from "../../../../assets/icons/redo.svg";
import "./LanguagesDropdown.css"; // Import the CSS file
import "./ControlButtons.css"; // CSS file for styling

const ControlButtons = ({ isScaled, onScale, toggleRefresh }) => {
  return (
    <div className="button-container">
      <button onClick={toggleRefresh} className="control-button">
        <img src={redo} alt="Refresh" />
      </button>
      <button onClick={onScale} className="control-button">
        <img src={isScaled ? collapse : expand} alt="scale" />
      </button>
    </div>
  );
};

// Custom Dropdown Indicator Component
const CustomDropdownIndicator = (props) => {
  return (
    <components.DropdownIndicator {...props}>
      <img src={dropdown} alt="dropdown" />
    </components.DropdownIndicator>
  );
};

const LanguagesDropdown = ({ onSelectChange, isScaled, onScale, toggleRefresh }) => {
  const [isPressed, setIsPressed] = useState(false);

  // Event handlers to manage pressing state
  const handleMouseDown = () => setIsPressed(true);
  const handleMouseUpOrLeave = () => setIsPressed(false);

  return (
    <div
      className={"sami"}
      style={{
        display: "flex",
        flex: "1 0 0",
        color: "var(--White, #FFF)",
        gap: "12px",
        borderBottom: "1px solid var(--White-16, rgba(255, 255, 255, 0.16))",
        border: "none",
        padding: "12px",
        justifyContent: "space-between",
        alignItems: "center",
        alignSelf: "stretch",
        justifyItems: "center",
      }}
    >
      <div
        className={`dropdown-container ${isPressed ? "pressed" : ""}`}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
      >
        <Select
          placeholder="Filter By Category"
          options={languageOptions}
          components={{ DropdownIndicator: CustomDropdownIndicator }}
          classNamePrefix="custom-select"
          styles={{
            control: (styles, { isFocused, isDisabled }) => ({
              ...styles,
              backgroundColor: isFocused ? "#4b4b4b" : "",
              width: "200px",
              border: "none",
              color: "#fff",
              fontFamily: "Inter",
              fontSize: "16px",
              fontWeight: "500",
              minHeight: "36px",
              boxShadow: "none",
              padding: "4px 8px",
              cursor: isDisabled ? "not-allowed" : "pointer",
              ":hover": {
                backgroundColor: "rgba(255, 255, 255, 0.12)", // Hover state
              },
            }),
            input: (styles) => ({
              ...styles,
              color: "#fff",
            }),
            singleValue: (styles) => ({
              ...styles,
              color: "#fff",
            }),
            placeholder: (styles) => ({
              ...styles,
              fontFamily: "Inter",
              fontSize: "16px",
              fontWeight: "500",
              color: "#ffffff",
            }),
            option: (styles, { isSelected, isFocused, isDisabled }) => ({
              ...styles,
              backgroundColor: isFocused
                ? "#414141"
                : isSelected
                ? "#3b3b3b"
                : "#2e2e2e",
              color: isDisabled ? "#ffff" : "#fff",
              padding: "8px 12px",
              cursor: isDisabled ? "not-allowed" : "pointer",
              ":active": {
                backgroundColor: "#4b4b4b",
              },
            }),
            menu: (styles) => ({
              ...styles,
              backgroundColor: "#2e2e2e",
              margin: "0",
              padding: "0",
              color: "var(--White, #FFF)",
              fontFamily: "Inter",
              fontSize: "16px",
              fontWeight: "500",
            }),
            menuList: (styles) => ({
              ...styles,
              padding: "0",
            }),
            dropdownIndicator: (styles, { isFocused }) => ({
              ...styles,
              color: isFocused ? "#ccc" : "#fff",
              padding: "4px",
            }),
            indicatorSeparator: () => ({
              display: "none",
            }),
          }}
          defaultValue={languageOptions[0]}
          onChange={(selectedOption) => onSelectChange(selectedOption)}
        />
      </div>
      <ControlButtons
        isScaled={isScaled}
        onScale={onScale}
        toggleRefresh={toggleRefresh}
      />
    </div>
  );
};

export default LanguagesDropdown;
