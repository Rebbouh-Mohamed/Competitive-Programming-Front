import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import _ from "lodash"; // Import Lodash
import { useDispatch } from "react-redux"; // Import useDispatch for Redux
import PrimaryButton from "../ui-elements/buttons/PrimaryButton";
import { joinContest } from "../../../redux/join/action"; // Adjust path to where the joinContest action is located

const LobbyHeader = React.memo(({ Contest }) => {
  const [timeLeft, setTimeLeft] = useState("");
  const [Title, setTitle] = useState("");
  const [isTimeUp, setIsTimeUp] = useState(false); // Track if time is up
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Initialize dispatch

  useEffect(() => {
    if (Contest?.contest?.start_time) {
      const startTime = new Date(Contest.contest.start_time).getTime();

      const calculateTimeLeft = () => {
        const currentTime = new Date().getTime();
        const difference = startTime - currentTime;

        if (difference > 0) {
          const minutes = Math.floor((difference / (1000 * 60)) % 60);
          const seconds = Math.floor((difference / 1000) % 60);
          const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
          const days = Math.floor(difference / (1000 * 60 * 60 * 24));

          let timeString = "";
          if (days > 0) timeString += `${days}d `;
          if (hours > 0) timeString += `${hours}h `;
          timeString += `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

          setTimeLeft(timeString);
          setIsTimeUp(false);
        } else {
          setTimeLeft("00:00");
          setIsTimeUp(true);
        }
      };

      calculateTimeLeft();
      const timer = setInterval(calculateTimeLeft, 1000);

      return () => clearInterval(timer);
    }
  }, [Contest?.contest?.start_time]);

  // Function to handle the button click for joining the contest
  const handleJoinContest = () => {
    if (Contest.status === "active") {
      // Dispatch the joinContest action when the contest is active
      dispatch(joinContest(Contest.contest.id));
      navigate("/game-round")
    } else {
      // Handle inactive contest, you can show a message or alert here
    }
  };

  // Styling
  const container = {
    display: "flex",
    width: "90rem",
    padding: "2rem 4rem",
    flexDirection: "column",
    alignItems: "center",
  };
  const mTitledlesection = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "2rem",
  };

  return (
    <div style={container}>
      <div style={mTitledlesection}>
        <div
          style={{
            color: "var(--White, #FFFFFF)",
            fontFamily: "Inter",
            fontSize: "48px",
            fontStyle: "normal",
            fontWeight: "700",
            lineHeight: "60px",
          }}
        >
          {Title ? Title : "The"} lobby
        </div>
        <PrimaryButton
          txt={
            Contest
              ? !(isTimeUp || Contest.status == "active")
                ? "Wait till the game be ready"
                : "Join the game"
              : "Wait..."
          } // Change button text if time is up
          full
          onClick={handleJoinContest} // Handle button click to join contest
          isicon={Contest ? true : false}
          disabled={Contest ? !(isTimeUp || Contest.status == "active") : true} // Disable if time is up or contest is not active
        />
        <div
          style={{
            color: "var(--White, #FFF)",
            textAlign: "center",
            fontFamily: "Inter",
            fontSize: "1rem",
            fontStyle: "normal",
            fontWeight: "500",
            lineHeight: "1.5rem",
          }}
        >
          {!isTimeUp
            ? Contest
              ? Contest.status === "none"
                ? "There is No game contest right now"
                : Contest.status === "upcoming"
                  ? `Game starts in: ${timeLeft}`
                  : ""
              : ""
            : ""}
        </div>
      </div>
    </div>
  );
});

export default LobbyHeader;
