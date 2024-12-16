import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Landing from "../components/sections/codeEditor/elemnts/Landing.jsx";
import GameHUD from "../components/sections/GameHUD.jsx";
import ProblemSection from "../components/sections/ProblemSection.jsx";
import Push from "../components/sections/Push.jsx";
import { getproblem } from "../../redux/problems/action.js";
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
  const [showLanding, setShowLanding] = useState(true);
  const [selectedProblemId, setSelectedProblemId] = useState(null); // Track selected problem
  const dispatch = useDispatch();
  const [selectedProblem, setSelectedProblem] = useState(null)

  // Access problems from Redux state

   // Check if 'problems' is available in the state  
  // Fetch problems when the component mounts
  useEffect(() => {
    dispatch(getproblem());
  }, [dispatch]);
  const { problems = [], isLoading = false, error = null } = useSelector(
    (state) => state.problems// Fallback to an empty object
  );
  
  const handleProblemClick = (problemId) => {
    setSelectedProblemId(problemId);
    setSelectedProblem(problems.find((problem) => problem.id === problemId))
    console.log(selectedProblem)
    setShowLanding(false); // Switch to Landing component
  };
  return (
    <div style={GameRoundStyle}>
      <GameHUD
        onButtonClick={() => setShowLanding(true)} // Return to ProblemSection
        showLanding={showLanding} // Pass current state
        InfoHUD={selectedProblem ? selectedProblem : {}} // Ensure problems array is accessed safely
        Time={Time}
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
            <ProblemSection
              problems={problems}
              handleProblemClick={handleProblemClick} // Handle problem click
            />
          )}
          {!showLanding && <Push />}
        </>
      )}
    </div>
  );
};

export default GRound;
