import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Landing from "../components/sections/codeEditor/elemnts/Landing.jsx";
import GameHUD from "../components/sections/GameHUD.jsx";
import ProblemSection from "../components/sections/ProblemSection.jsx";
import Push from "../components/sections/Push.jsx";
import MatchInfo from "../components/sections/tournament/MatchInfo.jsx";
import { getproblem } from "../../redux/problems/action.js";
import { getUpcomingContest } from "../../redux/contests/action";
import getWebSocketUrl from "../utils/websocket.js";
import api from "../context/api.js";
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
  const navigate = useNavigate();
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

    }
  }, [upcomingContest]);
  const [showLanding, setShowLanding] = useState(true);
  const [selectedProblemId, setSelectedProblemId] = useState(null); // Track selected problem
  const [selectedProblem, setSelectedProblem] = useState(null);

  // Cup contest match result modal state
  const [matchResultModal, setMatchResultModal] = useState(null); // null | { result: 'win' | 'loss' }

  // WebSocket connection for Cup contests to listen for match results
  useEffect(() => {
    // Only connect if it's a cup contest and user is in a problem (not showing landing/match info)
    if (upcomingContest?.contest?.type === 'cup' && !showLanding) {
      // Get JWT token from localStorage
      const token = localStorage.getItem('access');
      const wsUrl = getWebSocketUrl(`/ws/submission/?token=${token}`);
      let ws = null;

      try {
        ws = new WebSocket(wsUrl);

        ws.onopen = () => {

        };

        ws.onmessage = (event) => {


          try {
            const data = JSON.parse(event.data);


            // Filter: Only process match_result messages, ignore debug/auth messages
            if (data.type === 'match_result') {

              setMatchResultModal({ result: data.result });

            } else if (data.type === 'auth_success') {

            } else if (data.type === 'auth_warning') {
              console.warn("⚠️ WebSocket Auth Warning:", data.message);
            } else {

            }

          } catch (error) {
            console.error("❌ Failed to parse WebSocket message:", error);
            console.error("❌ Raw data was:", event.data);
          }
        };

        ws.onerror = (error) => {
          console.error("❌ WebSocket error:", error);
        };

        ws.onclose = (event) => {
          if (event.code !== 1000) {
            console.warn(`⚠️ WebSocket closed unexpectedly. Code: ${event.code}`);
          }
        };

      } catch (error) {
        console.error("❌ Failed to create WebSocket:", error);
      }

      return () => {
        if (ws && ws.readyState === WebSocket.OPEN) {

          ws.close(1000, "Component unmounting");
        }
      };
    }
  }, [upcomingContest?.contest?.type, showLanding]);

  // Handle match result modal close
  const handleMatchResultModalClose = () => {
    const isLoser = matchResultModal?.result === 'loss';
    setMatchResultModal(null);

    if (isLoser) {
      // Loser: Redirect to lobby

      navigate('/lobby');
    } else {
      // Winner: Return to match info / lobby view
      setShowLanding(true);
      setSelectedProblem(null);
      navigate('/lobby');

    }
  };

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
            upcomingContest?.contest?.type === 'cup' ? (
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

      {/* Match Result Modal for Cup Contests */}
      {matchResultModal && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              backgroundColor: "#1e1e1e",
              padding: "3rem",
              borderRadius: "16px",
              textAlign: "center",
              color: "white",
              maxWidth: "500px",
              width: "90%",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
            }}
          >
            {matchResultModal.result === 'win' ? (
              <>
                <h2 style={{
                  color: "#32D74B",
                  marginBottom: "1.5rem",
                  fontSize: "2.5rem",
                  fontWeight: "bold"
                }}>
                  🎉 Congratulations! 🎉
                </h2>
                <p style={{ fontSize: "1.2rem", marginBottom: "2rem", color: "#E7E7E7" }}>
                  You won the match!
                </p>
              </>
            ) : (
              <>
                <h2 style={{
                  color: "#FF453A",
                  marginBottom: "1.5rem",
                  fontSize: "2.5rem",
                  fontWeight: "bold"
                }}>
                  Match Over
                </h2>
                <p style={{ fontSize: "1.2rem", marginBottom: "2rem", color: "#E7E7E7" }}>
                  You lost this match. Better luck next time!
                </p>
              </>
            )}
            <button
              onClick={handleMatchResultModalClose}
              style={{
                marginTop: "1rem",
                padding: "0.75rem 2rem",
                backgroundColor: "#0A84FF",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "1.1rem",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              Back to Lobby
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GRound;
