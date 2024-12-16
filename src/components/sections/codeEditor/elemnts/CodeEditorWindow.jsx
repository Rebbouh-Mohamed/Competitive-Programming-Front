import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import "./CodeEditorWindow.css";

const CodeEditorWindow = ({ isScaled, onChange, language, code, theme }) => {
  const [value, setValue] = useState(code || "");
  // Update value whenever 'code' prop changes
  useEffect(() => {
    setValue(code);
  }, [code]);

  const handleEditorChange = (value) => {
    setValue(value);
    onChange("code", value); // Notify parent of code change
  };

  return (
    <div
      className="container-editor"
      style={{
        display: "flex",
        height: "548px",
        alignItems: "flex-start",
        alignSelf: "stretch",
        width: !isScaled ? "44.2rem": "1440px",
        borderRadius: "0 0 16px 16px", // Add border radius
        overflow: "hidden", // Ensure content respects the border radius
        border: "none", // Optional: Add a border
        boxShadow: "none", // Remove shadow for the container
      }}
    >
      <Editor
        height="100%"
        width="100%"
        language={language || "javascript"}
        value={value}
        theme={theme}
        onChange={handleEditorChange}
        options={{
          minimap: { enabled: false },
        }}
        className="monaco-custom-editor" // Apply custom class
      />
    </div>
  );
};

export default CodeEditorWindow;
