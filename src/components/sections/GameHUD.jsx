import React, { useState, useEffect } from "react";
import "./codeEditor/elemnts/ControlButtons.css";
import side from "../../assets/icons/side.svg";
import infoIcon from "../../assets/icons/infoicon.svg"; // Replace with the actual path to your info icon
import { LineWeight } from "@mui/icons-material";

const Button = ({ onButtonClick }) => (
  <div className="button-container">
    <button className="control-button" onClick={onButtonClick}>
      <img src={side} alt="side" />
    </button>
  </div>
);

const Tooltip = ({ text }) => <div className="tooltip">{text}</div>;

const styles = {
  gameHUD: {
    display: "flex",
    width: "1440px",
    padding: "16px 64px",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "24px",
  },
  buttonContainer: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flex: "1 0 0",
  },
  text: {
    color: "var(--White, #FFF)",
    fontFamily: "Inter",
    fontSize: "24px",
    fontStyle: "normal",
    fontWeight: "600",
    lineHeight: "32px",
  },
  timeContainer: {
    display: "flex",
    padding: "8px 16px",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "50px",
    background: "var(--White-12, rgba(255, 255, 255, 0.12))",
  },
  dayText: {
    color: "var(--White, #FFF)",
    textAlign: "right",
    fontFamily: "Inter",
    fontSize: "24px",
    fontStyle: "normal",
    fontWeight: "600",
    flex: "1 0 0",
    lineHeight: "32px",
  },
  infoIconContainer: {
    position: "relative",
    display: "inline-block",
  },
  tooltip: {
    position: "absolute",
    top: "-50px",
    left: "50%",
    transform: "translateX(-50%)",
    padding: "8px",
    borderRadius: "4px",
    whiteSpace: "nowrap",
    fontSize: "14px",
    zIndex: "10",
    visibility: "hidden",
    opacity: "0",
    transition: "opacity 0.3s ease",
    color: "var(--White, #FFF)",
    textAlign: "center",
    fontFamily: "Inter",

    fontStyle: "normal",
    fontWeight: "500",
    lineHeight: "16px",

    display: "flex",
    width: "359px",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
  },
  tooltipVisible: {
    visibility: "visible",
    opacity: "1",
  },
};

const GameHUD = ({
  onButtonClick,
  showLanding,
  Title,
  InfoHUD,
  Time = { startTime: "2024-12-12T20:42:07Z", endTime: "2025-02-15T22:10:09Z" },
}) => {
  const [timeLeft, setTimeLeft] = useState({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const xEasy = 5;
  const xHard = 5;
  const xMedium = 5;
  const [showTooltip, setShowTooltip] = useState(false);
  useEffect(() => {
    const startTime = Time.startTime;
    const endTime = Time.endTime;
    //console.log(Time);
    const calculateTimeLeft = () => {
      const now = new Date();
      const endDate = new Date(endTime);

      if (now > endDate) {
        setTimeLeft({
          years: 0,
          months: 0,
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });
        return;
      }

      const totalSeconds = Math.floor((endDate - now) / 1000);

      const days = Math.floor(totalSeconds / (24 * 60 * 60));
      const remainingAfterDays = totalSeconds % (24 * 60 * 60);

      const hours = Math.floor(remainingAfterDays / (60 * 60));
      const remainingAfterHours = remainingAfterDays % (60 * 60);

      const minutes = Math.floor(remainingAfterHours / 60);
      const seconds = remainingAfterHours % 60;

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTimeLeft();
    const timerInterval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timerInterval);
  }, [Time.endTime]);

  return (
    <div style={styles.gameHUD}>
      <div style={styles.buttonContainer}>
        {!showLanding && <Button onButtonClick={onButtonClick} />}
        <p style={styles.text}>
          {showLanding
            ? "Competitive Programming"
            : InfoHUD.title || "Problem title"}
        </p>{" "}
        <div style={styles.infoIconContainer}>
          <img
            src={infoIcon}
            alt="info"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            style={{ cursor: "pointer" }}
          />{" "}
          {showTooltip && (
            <div style={{ ...styles.tooltip, ...styles.tooltipVisible }}>
              <p
                style={{
                  display: "flex",
                  padding: "12px 8px",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "4px",
                  background: "var(--White-12, rgba(255, 255, 255, 0.12))",
                  alignSelf: "stretch",
                }}
              >
                {` Problems are worth different points: Easy ${xEasy} points,\nMedium
                ${xMedium} points, and Hard ${xHard} points. Point values are set\n                by ITC
                Leadership and may vary by game.`}
              </p>
            </div>
          )}
        </div>
      </div>
      <div style={styles.timeContainer}>
        <p
          style={styles.text}
        >{`${timeLeft.hours.toString().padStart(2, '0')}:${timeLeft.minutes.toString().padStart(2, '0')}:${timeLeft.seconds.toString().padStart(2, '0')}`}</p>
      </div>

      <p style={styles.dayText}>{Title ? Title : 0}</p>
    </div>
  );
};

export default GameHUD;
