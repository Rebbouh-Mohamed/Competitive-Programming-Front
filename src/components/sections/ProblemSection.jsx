import React, { useState, useEffect } from "react";
import ReactLoading from "react-loading";
import circle from "../../assets/icons/circle.svg";
import solved from "../../assets/icons/solved.svg";
import greencheck from "../../assets/icons/greencheck.svg";
import error from "../../assets/icons/error.svg";
import warning from "../../assets/icons/warning.svg";

const ProblemCard = ({
  title = "Problem title",
  difficulty = "Difficulty",
  points = 0,
  next_points = null,
  subbmitted = false,
  onClick
}) => {

  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const styles = {
    container: {
      alignSelf: "stretch",
      borderRadius: 8,
      overflow: "hidden",
      justifyContent: "space-between",
      alignItems: "center",
      display: "inline-flex",
    },
    innerContainer: {
      border: "none",
      flex: "1 1 0",
      paddingLeft: 24,
      paddingRight: 24,
      paddingTop: 12,
      paddingBottom: 12,
      justifyContent: "space-between",
      alignItems: "center",
      display: "flex",
      backgroundColor: isPressed
        ? "#3b3b3b" // Darker color when pressing
        : isHovered
          ? "#2c2c2c" // Lighter color when hovering
          : "transparent", // Default color when normal
    },
    titleContainer: {
      flex: "1 1 0",
      height: 24,
      justifyContent: "flex-start",
      alignItems: "center",
      gap: 70,
      display: "flex",
    },
    iconContainer: {
      height: 24,
      justifyContent: "center",
      alignItems: "center",
      gap: 10,
      width: 40,
      display: "flex",
    },
    icon: {
      width: 24,
      height: 24,
      position: "relative",
    },
    titleText: {
      flex: "1 1 0",
      color: "white",
      fontSize: 16,
      fontFamily: "Inter",
      fontWeight: "500",
      textAlign: "start",
      wordWrap: "break-word",
    },
    detailsContainer: {
      flex: "1 1 0",
      height: 20,
      justifyContent: "space-between",
      alignItems: "center",
      display: "flex",
    },
    accuracyText: {
      flex: "1 1 0",
      textAlign: "center",
      color: "#E7E7E7",
      fontSize: 14,
      fontFamily: "Inter",
      fontWeight: "400",
      wordWrap: "break-word",
    },
    difficultyText: {
      flex: "1 1 0",
      textAlign: "center",
      color:
        difficulty == "easy"
          ? "#32D74B"
          : difficulty == "mid"
            ? "#FFD60A"
            : "#FF453A",
      fontSize: 14,
      fontFamily: "Inter",
      fontWeight: "400",
      wordWrap: "break-word",
    },
  };

  return (
    <div style={styles.container}>
      <button
        style={styles.innerContainer}
        onClick={onClick} // Trigger the onClick handler
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
      >
        <div style={styles.titleContainer}>
          <div style={styles.iconContainer}>
            <div style={styles.icon}>
              <img src={subbmitted == false ? circle : solved} alt="status" />
            </div>
          </div>
          <div style={styles.titleText}>{title}</div>
        </div>
        <div style={styles.detailsContainer}>
          <div style={styles.accuracyText}>
            {points} pts
            {next_points !== null && (
              <span style={{ fontSize: 10, color: "#929292", marginLeft: 4 }}>
                (Next: {next_points})
              </span>
            )}
          </div>
          <div style={styles.difficultyText}>{difficulty}</div>
        </div>
      </button>
    </div>
  );
};

function ProgressBar({ Subbmition, TotalProblems, accuracy }) {
  const [feedbackMessage, setFeedbackMessage] = useState(
    "Checking your solutions… Please wait."
  );
  const [feedbackColor, setFeedbackColor] = useState("#929292");
  const [feedbackIcon, setFeedbackIcon] = useState(null);

  // Function to get feedback based on submission score
  const getFeedback = (score) => {
    if (score >= 80) {
      return {
        message: "Well done! Most of your solutions are highly accurate.",
        color: "#32D74B",
        icon: greencheck,
      };
    } else if (score >= 50) {
      return {
        message:
          "Your solutions are on track. Refine a few to boost your score.",
        color: "#FFD60A",
        icon: warning,
      };
    } else {
      return {
        message: "Focus on refining your solutions to improve your score.",
        color: "#FF453A",
        icon: error,
      };
    }
  };

  useEffect(() => {
    const { message, color, icon } = getFeedback(accuracy);

    const timeoutId = setTimeout(() => {
      setFeedbackMessage(message);
      setFeedbackColor(color);
      setFeedbackIcon(icon);
    }, 1500);

    return () => clearTimeout(timeoutId); // Cleanup on unmount
  }, [Subbmition]);

  const isChecking =
    feedbackMessage === "Checking your solutions… Please wait.";

  const progressBarStyles = {
    container: {
      display: "inline-flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      borderTop: "1px #414141 solid",
      width: 1440,
      paddingBottom: 32,
    },
    progressSection: {
      display: "inline-flex",
      flexDirection: "column",
      alignItems: "flex-start",
      paddingTop: 24,
      gap: 4,
      width: 256,
    },
    progressBar: {
      width: 256,
      height: 8,
      position: "relative",
      background: "rgba(255, 255, 255, 0.12)",
      borderRadius: 50,
    },
    progressIndicator: {
      width: `${(Subbmition * 100) / TotalProblems}%`,
      height: 8,
      position: "absolute",
      background: "#0A84FF",
      borderRadius: 50,
      top: 0,
      left: 0,
    },
    progressText: {
      fontSize: 14,
      color: "#929292",
      fontFamily: "Inter",
      fontWeight: "400",
      wordWrap: "break-word",
    },
    feedbackSection: {
      display: "flex",
      justifyContent: isChecking ? "flex-end" : "flex-start",
      alignItems: "center",
      gap: 8,
      paddingTop: 24,
      width: isChecking ? "100%" : "auto",
    },
    feedbackIcon: {
      width: 24,
      height: 24,
    },
    feedbackText: {
      fontSize: 14,
      color: feedbackColor,
      fontFamily: "Inter",
      fontWeight: "400",
      wordWrap: "break-word",
    },
  };

  return (
    <div style={progressBarStyles.container}>
      {!isChecking && (
        <div style={progressBarStyles.progressSection}>
          <div style={progressBarStyles.progressBar}>
            <div style={progressBarStyles.progressIndicator} />
          </div>
          <div style={progressBarStyles.progressText}>
            {Subbmition}/{TotalProblems} problems solved
          </div>
        </div>
      )}
      <div style={progressBarStyles.feedbackSection}>
        <div style={progressBarStyles.feedbackIcon}>
          {isChecking ? (
            <ReactLoading
              type="spin"
              color="#929292"
              height="24px"
              width="24px"
            />
          ) : (
            <img src={feedbackIcon} alt="feedback icon" />
          )}
        </div>
        <div style={progressBarStyles.feedbackText}>{feedbackMessage}</div>
      </div>
    </div>
  );
}
function ProblemSection({ problems, handleProblemClick }) {
  const CalcSubmission = () => {
    return problems.filter((problem) => problem.submitted).length;
  };
  const CalcAccuracy = () => {
    const solvableProblems = problems.filter(
      (problem) => problem.submitted
    );
    const totalAccuracy = solvableProblems.reduce(
      (sum, problem) => sum + problem.percentage,
      0
    );
    return solvableProblems.length > 0 ? totalAccuracy / problems.length : 0; // Avoid division by zero
  };
  const styles = {
    container: {
      width: 1440,
      height: 668,
      paddingLeft: 64,
      paddingRight: 64,
      paddingTop: 32,
      flexDirection: "column",
      justifyContent: "flex-start",
      alignItems: "flex-start",
      display: "inline-flex",
    },
    header: {
      alignSelf: "stretch",
      paddingLeft: 24,
      paddingRight: 24,
      paddingTop: 12,
      paddingBottom: 12,
      borderBottom: "1px #414141 solid",
      justifyContent: "space-between",
      alignItems: "center",
      display: "inline-flex",
    },
    headerLeft: {
      flex: "1 1 0",
      height: 20,
      justifyContent: "flex-start",
      alignItems: "center",
      gap: 64,
      display: "flex",
    },

    text: {
      width: 44,
      color: "#E7E7E7",
      fontSize: 14,
      fontFamily: "Inter",
      fontWeight: "400",

      wordWrap: "break-word",
    },
    titleText: {
      width: 524,
      color: "#E7E7E7",
      fontSize: 14,
      fontFamily: "Inter",
      fontWeight: "400",

      wordWrap: "break-word",
    },
    headerRight: {
      flex: "1 1 0",
      height: 20,
      justifyContent: "space-between",
      alignItems: "center",
      display: "flex",
    },
    centerText: {
      flex: "1 1 0",
      textAlign: "center",
      color: "#E7E7E7",
      fontSize: 14,
      fontFamily: "Inter",
      fontWeight: "400",

      wordWrap: "break-word",
    },
    content: {
      alignSelf: "stretch",

      paddingTop: 12,
      paddingBottom: 12,
      flexDirection: "column",
      justifyContent: "flex-start",
      alignItems: "flex-start",
      display: "flex",
    },
  };
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.text}>Status</div>
          <div style={styles.titleText}>Title</div>
        </div>
        <div style={styles.headerRight}>
          <div style={styles.centerText}>Points</div>
          <div style={styles.centerText}>Difficulty</div>
        </div>
      </div>
      <div style={styles.content}>
        {problems.map((problem, index) => (

          <ProblemCard
            key={index}
            title={problem.title || `Problem ${index + 1}`}
            difficulty={problem.level || "Medium"}
            points={problem.point || 0}
            next_points={problem.next_point}
            subbmitted={problem.status === "solved"}
            onClick={(e) => !(problem.status === "solved") ? handleProblemClick(problem.id) : e.preventDefault()} // Pass problem ID
          />
        ))}
      </div>
      <ProgressBar
        Subbmition={CalcSubmission()}
        TotalProblems={problems.length}
        accuracy={CalcAccuracy()}
      />
    </div>
  );
}
export default ProblemSection;
