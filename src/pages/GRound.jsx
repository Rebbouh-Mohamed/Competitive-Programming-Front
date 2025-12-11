import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Landing from "../components/sections/codeEditor/elemnts/Landing.jsx";
import GameHUD from "../components/sections/GameHUD.jsx";
import ProblemSection from "../components/sections/ProblemSection.jsx";
import Push from "../components/sections/Push.jsx";
import MatchInfo from "../components/sections/tournament/MatchInfo.jsx";
import { getproblem } from "../../redux/problems/action.js";
import { getUpcomingContest } from "../../redux/contests/action"; // Action to get the contest data


// Import the action to fetch problems
const GameRoundStyle = {
  display: "flex",
  width: "1440px",
  padding: "16px 64px",
  flexDirection: "column",
  justifyContent: "space-between",
  alignItems: "center",
};

const GRound = ({ Day = 0, Time }) => {
  const dispatch = useDispatch();
  const { upcomingContest } = useSelector((state) => state.contests);

  // Fetch the upcoming contest if it's not already available in Redux
  useEffect(() => {
    if (!upcomingContest) {
      dispatch(getUpcomingContest());
    }
  }, [dispatch, upcomingContest]);

  useEffect(() => {
    // Log the upcoming contest when it's available
    if (upcomingContest) {
      /* console.log(
        upcomingContest
          ? {
              endTime: `${upcomingContest?.data?.contest?.end_time}`,
              startTime: `${upcomingContest?.data?.contest?.start_time}`,
            }
          : ""
      ); */
    }
  }, [upcomingContest]);
  const [showLanding, setShowLanding] = useState(true);
  const [selectedProblemId, setSelectedProblemId] = useState(null); // Track selected problem
  const [selectedProblem, setSelectedProblem] = useState(null);

  // Access problems from Redux state

  // Check if 'problems' is available in the state
  // Fetch problems when the component mounts
  useEffect(() => {
    dispatch(getproblem());
  }, [dispatch]);
  const {
    problems = [],
    isLoading = false,
    error = null,
  } = useSelector(
    (state) => state.problems // Fallback to an empty object
  );

  const handleProblemClick = (problemId) => {
    setSelectedProblemId(problemId);
    setSelectedProblem(problems.find((problem) => problem.id === problemId));
    //console.log(selectedProblem);
    setShowLanding(false); // Switch to Landing component
  };

  return (
    <div style={GameRoundStyle}>
      <GameHUD
        onButtonClick={() => setShowLanding(true)} // Return to ProblemSection
        showLanding={showLanding} // Pass current state
        InfoHUD={selectedProblem ? selectedProblem : {}} // Ensure problems array is accessed safely
        Constent={upcomingContest ? upcomingContest : {}}
        Title={upcomingContest ? upcomingContest.contest.title : ""}
        Time={{
          endTime: `${upcomingContest?.contest?.end_time}`,
          startTime: `${upcomingContest?.contest?.start_time}`,
        }}
      />

      {isLoading ? (
        <p>Loading problems...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <>
          {!showLanding ? (
            <Landing problem={selectedProblem} /> // Pass selected problem safely
          ) : (
            upcomingContest?.contest?.type === 'cup' || upcomingContest?.contest?.type === 'arena' ? (
              <MatchInfo
                contestId={upcomingContest.contest.id}
                onStartProblem={(problem) => {
                  setSelectedProblem(problem);
                  setShowLanding(false);
                }}
              />
            ) : (
              <ProblemSection
                problems={problems}
                handleProblemClick={handleProblemClick} // Handle problem click
              />
            )
          )}

        </>
      )}
    </div>
  );
};

export default GRound;
