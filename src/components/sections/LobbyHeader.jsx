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

      // Define the throttled function
      const throttledCalculateTimeLeft = _.throttle(() => {
        const currentTime = new Date().getTime();
        const difference = startTime - currentTime;

        if (difference > 0) {
          const minutes = Math.floor((difference / (1000 * 60)) % 60);
          const seconds = Math.floor((difference / 1000) % 60);

          setTimeLeft(
            `${minutes.toString().padStart(2, "0")}:${seconds
              .toString()
              .padStart(2, "0")}`
          );
          setIsTimeUp(false); // Reset time up state while countdown
        } else {
          setTimeLeft("00:00"); // Contest has started
          setIsTimeUp(true); // Set time up state to true
        }
      }, 1000); // Throttle execution to once every second

      // Call the throttled function initially
      throttledCalculateTimeLeft();

      // Set an interval to regularly call the throttled function
      const timer = setInterval(() => throttledCalculateTimeLeft(), 1000);
      setTitle(Contest.contest.title);

      // Cleanup: Clear interval and cancel any throttled calls on unmount
      return () => {
        clearInterval(timer);
        throttledCalculateTimeLeft.cancel(); // Cancel pending throttled calls
      };
    }
  }, [Contest?.contest?.start_time, Contest?.contest?.id]);

  // Function to handle the button click for joining the contest
  const handleJoinContest = () => {
    if (Contest.status === "active") {
      // Dispatch the joinContest action when the contest is active
      dispatch(joinContest(Contest.contest.id));
    } else {
      // Handle inactive contest, you can show a message or alert here
      console.log("Contest is not active yet.");
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
