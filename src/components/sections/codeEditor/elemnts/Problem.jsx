import React from "react";
import bulleye from "../../../../assets/icons/bulleye.svg";
import "./CodeEditorWindow.css";
function Problem({
  isScaled,
  problem,
  goal = "Define a meaningful goal here.",
  input = "Describe the input for the problem.",
  output = "Describe the expected output for the problem.",
  constraints = "List the constraints for the problem.",
  exampleInput = "Provide an example input here.",
  exampleOutput = "Provide an example output here.",
}) {
  console.log(problem);
  if (problem) {
    goal = problem.description;
    input = problem.input_desc;
    output = problem.output_desc;
    //constraints = problem.constraints;
    //exampleInput = problem.exampleInput;
    //exampleOutput = problem.exampleOutput;
  }
  // Define styles as an object
  const styles = {
    container: {
      height: "100%",

      width: "50%",
      borderRadius: 16,
      overflow: "hidden",
      display: isScaled ? "none" : "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      alignItems: "stretch",
      transform: "none", // Correct syntax for `transform`
    },
    goalSection: {
      display: "flex",
      padding: "30px 24px",
      flexDirection: "column",
      gap: "16px",
      alignSelf: "stretch",
      justifyContent: "space-between",
      height: "90%",
      background: "var(--White-12, rgba(255, 255, 255, 0.12))",
    },
    headerRow: {
      width: "100%",
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 8,
    },
    goalTitleText: {
      width: "100%",
      color: "#E7E7E7",
      fontSize: 16,
      fontFamily: "Inter, sans-serif",
      fontWeight: 500,
      lineHeight: "24px",
    },
    goalDescription: {
      width: "100%",
      color: "white",
      fontSize: 14,
      fontFamily: "Inter, sans-serif",
      fontWeight: 400,
      lineHeight: "20px",
    },
    detailsSection: {
      display: "flex",
      padding: "24px 0px",
      flexDirection: "column",
      alignItems: "flex-start",
      height: "90%",
      alignSelf: "stretch",
      borderRadius: "0px 0px 0px 0px",
      background: "var(--White-16, rgba(255, 255, 255, 0.16))",
    },
    sectionHeader: {
      display: "flex",
      padding: "16px 24px",
      flexDirection: "column",
      alignItems: "flex-start",
      gap: "16px",
      alignSelf: "stretch",
      borderBottom: "1px solid var(--White-16, rgba(255, 255, 255, 0.16))",
    },
    sectionHeaderText: {
      width: "100%",
      color: "#E7E7E7",
      fontSize: 16,
      fontFamily: "Inter, sans-serif",
      fontWeight: 500,
      lineHeight: "24px",
    },
    sectionDescriptionText: {
      width: "100%",
      color: "white",
      fontSize: 14,
      fontFamily: "Inter, sans-serif",
      fontWeight: 400,
      lineHeight: "20px",
    },
    exampleContainer: {
      width: "100%",
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center",
      gap: 16,
    },
    exampleBox: {
      display: "flex",
      padding: "12px 16px",
      flexDirection: "column",
      alignItems: "flex-start",
      gap: "8px",
      width: "100%",
      borderRadius: "16px",
      background: "var(--Medium-Gray, #414141)",
    },
    exampleBoxTitle: {
      width: "100%",
      color: "#929292",
      fontSize: 16,
      fontFamily: "Inter, sans-serif",
      fontWeight: 500,
      lineHeight: "24px",
    },
    exampleBoxText: {
      width: "100%",
      color: "white",
      fontSize: 14,
      fontFamily: "Inter, sans-serif",
      fontWeight: 400,
      lineHeight: "20px",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.goalSection}>
        <div style={styles.headerRow}>
          <img src={bulleye} alt="bulleye" />
          <div style={styles.goalTitleText}>The goal description</div>
        </div>
        <div style={styles.goalDescription}>{goal}</div>
      </div>
      <div style={styles.detailsSection}>
        <div style={styles.sectionHeader}>
          <div style={styles.sectionHeaderText}>Input</div>
          <div style={styles.sectionDescriptionText}>{input}</div>
        </div>
        <div style={styles.sectionHeader}>
          <div style={styles.sectionHeaderText}>Output</div>
          <div style={styles.sectionDescriptionText}>{output}</div>
        </div>
        <div style={styles.sectionHeader}>
          <div style={styles.sectionHeaderText}>Constraints</div>
          <div style={styles.sectionDescriptionText}>{constraints}</div>
        </div>
        <div style={{ ...styles.sectionHeader, borderBottom: "none" }}>
          <div style={styles.sectionHeaderText}>Example</div>
          <div style={styles.exampleContainer}>
            <div style={styles.exampleBox}>
              <div style={styles.exampleBoxTitle}>Input</div>
              <div style={styles.exampleBoxText}>{exampleInput}</div>
            </div>
            <div style={styles.exampleBox}>
              <div style={styles.exampleBoxTitle}>Output</div>
              <div style={styles.exampleBoxText}>{exampleOutput}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Problem;
