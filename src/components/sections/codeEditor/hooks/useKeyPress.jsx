import React, { useState, useEffect, useCallback } from "react";

const useKeyPress = (targetKey) => {
  const [keyPressed, setKeyPressed] = useState(false);

  // Memoize event handlers to ensure referential stability
  const downHandler = useCallback(
    ({ key }) => {
      if (key === targetKey) {
        setKeyPressed(true);
      }
    },
    [targetKey]
  );

  const upHandler = useCallback(
    ({ key }) => {
      if (key === targetKey) {
        setKeyPressed(false);
      }
    },
    [targetKey]
  );

  useEffect(() => {
    // Attach event listeners
    document.addEventListener("keydown", downHandler);
    document.addEventListener("keyup", upHandler);

    // Cleanup on unmount
    return () => {
      document.removeEventListener("keydown", downHandler);
      document.removeEventListener("keyup", upHandler);
    };
  }, [downHandler, upHandler]); // Dependency array ensures up-to-date handlers are used

  return keyPressed;
};

export default useKeyPress;
