
import React, { useState, useEffect } from "react";
import api from "../../context/api"
import { USERNAME } from "../../context/constant";

function sliceArray(arr, size = 12) {
  const result = [];
  let i = 0;

  while (i < arr.length) {
    if (arr.length - i <= size) {
      // If the remaining elements are less than or equal to 'size', push the rest as the last chunk
      result.push(arr.slice(i));
      break;
    } else {
      // Otherwise, push a chunk of 'size'
      result.push(arr.slice(i, i + size));
    }
    i += size;
  }

  return result;
}

import rules from "../../data/rules.json";

// LobbyMain.jsx
import whiteright from "../../assets/icons/whiteright.svg";
import whiteleft from "../../assets/icons/whiteleft.svg";
import bluecheck from "../../assets/icons/bluecheck.svg";
const Pagination = ({ page, onPrevClick, onNextClick, totalPages }) => {
  const prevButtonStyle = {
    width: 32,
    height: 32,
    opacity: page === 1 ? 0 : "",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    display: "inline-flex",
    borderRadius: "50px",
    background: "var(--White-12, rgba(255, 255, 255, 0.12))",
    border: "none",
  };

  const nextButtonStyle = {
    width: 32,
    height: 32,
    opacity: page === totalPages ? 0 : "",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    display: "inline-flex",
    borderRadius: "50px",
    background: "var(--White-12, rgba(255, 255, 255, 0.12))",
    border: "none",
  };

  const buttonContainerStyle = {
    borderRadius: 50,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    display: "inline-flex",
  };

  const innerButtonStyle = {
    padding: 4,
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
  };

  const pageNumbersContainerStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  };

  const pageNumberStyle = (isActive) => ({
    color: isActive ? "var(--White, #FFF)" : "var(--Light-Gray, #929292)",
    fontFamily: "Inter",
    fontSize: "16px",
    fontStyle: "normal",
    fontWeight: "500",
    lineHeight: "24px",
  });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
      }}
    >
      <button
        onClick={onPrevClick}
        disabled={page === 1}
        style={prevButtonStyle}
      >
        <div style={buttonContainerStyle}>
          <div style={innerButtonStyle}>
            <img src={whiteright} alt="whiteright" />
          </div>
        </div>
      </button>

      <div style={pageNumbersContainerStyle}>
        {Array.from({ length: totalPages }, (_, index) => (
          <p key={index} style={pageNumberStyle(page === index + 1)}>
            {index + 1}
          </p>
        ))}
      </div>

      <button
        onClick={onNextClick}
        disabled={page === totalPages}
        style={nextButtonStyle}
      >
        <div style={buttonContainerStyle}>
          <div style={innerButtonStyle}>
            <img src={whiteleft} alt="whiteleft" />
          </div>
        </div>
      </button>
    </div>
  );
};
const LobbyMain = () => {
  const styles = {
    container: {
      display: "flex",
      padding: "32px 64px 64px 64px",
      justifyContent: "center",
      alignItems: "flex-start",
      gap: "24px",
    },

    gameRulesSection: {
      padding: 24,
      background: "#414141",
      borderRadius: 16,
      display: "flex",
      flexDirection: "column",
      gap: 32,
    },
    rulesTitle: {
      color: "var(--White, #FFF)",
      fontFamily: "Inter",
      fontSize: "2rem",
      fontStyle: "normal",
      fontWeight: 700,
      lineHeight: "2.5rem",
    },
    rulesContainer: {
      display: "flex",
      flexDirection: "column",

      gap: 24,
    },
    ruleItem: {
      display: "flex",
      gap: "0.5rem",
    },
    ruleIcon: {
      width: 32,
      height: 32,
      position: "relative",
    },
    ruleContent: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      gap: "0.5rem",
    },
    ruleHeading: {
      color: "var(--White, #FFF)",
      fontFamily: "Inter",
      fontSize: "1.5rem",
      fontStyle: "normal",
      fontWeight: "600",
      lineHeight: "2rem",
    },
    ruleDescription: {
      fontSize: "1rem",
      fontStyle: "normal",
      color: "var(--Muted-Gray, #E7E7E7)",
      fontFamily: "Inter",
      fontWeight: "500", // Corrected from "Weight" to "fontWeight"
      lineHeight: "1.5rem",
    },
    joinedPlayersSection: {
      padding: 24,
      display: "flex",
      width: "41%",
      flexDirection: "column",
      gap: 32,
      alignItems: "center",
    },
    playersTitle: {
      color: "var(--White, #FFF)",
      fontFamily: "Inter",
      fontSize: "2rem",
      fontStyle: "normal",
      fontWeight: "700",
      lineHeight: "2.5rem",
      alignSelf: "stretch",
    },
    playersContainer: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gridTemplateRows: "repeat(4, 1fr)",
      gridRowGap: 24,
      gridColumnGap: 24,
      width: "100%", // Ensures full horizontal width
    },
    playerRow: {
      display: "flex",
      gap: 24,
    },
    waitingMessage: {
      color: "var(--Light-Gray, #929292)",
      fontFamily: "Inter",
      fontSize: "1rem",
      fontStyle: "normal",
      fontWeight: "500",
      lineHeight: "1.5rem",
      textAlign: "end",
    },
    playerCardIsCurrentMultip: (isCurrent) => ({
      flex: "1 1 100%", // Added flex-grow, flex-shrink, and basis to ensure stretching
      background: isCurrent ? "#414141" : "rgba(255, 255, 255, 0.12)",
      border: isCurrent ? "transparent" : "none", // Focused border color
      outline: isCurrent ? "2px solid var(--White, #FFF)" : "none", // Focused border color
      display: "flex",
      padding: "0.75rem 0rem",
      flexDirection: "column",
      alignItems: "center",
      gap: "0.5rem",
      alignSelf: "stretch",
      borderRadius: "0.5rem",
    }),
    playerAvatar: {
      width: "6rem",
      height: "6rem",
      borderRadius: "50%",
      backgroundColor: "lightgray",
      backgroundImage: "url(https://via.placeholder.com/96x96)",
      backgroundSize: "cover",
      backgroundPosition: "center",
    },
    playerUsername: {
      color: "var(--Muted-Gray, #E7E7E7)",
      textAlign: "center",
      fontFamily: "Inter",
      fontSize: "1rem",
      fontStyle: "normal",
      fontWeight: "500",
      lineHeight: "1.5rem",
    },
    playerStatus: (isReady) => ({
      alignSelf: "stretch",
      color: isReady ? "var(--Green, #32D74B)" : "var(--White, #FFF)",
      textAlign: "center",
      fontFamily: "Inter",
      fontSize: "0.875rem",
      fontStyle: "normal",
      fontWeight: "400",
      lineHeight: "1.25rem",
    }),
  };
  const [page, setPage] = useState(1);
  const [playersChunks, setPlayersChunks] = useState([]);
  const [players, setPlayers] = useState([]); // Store fetched players here

  const totalPages = playersChunks.length;

  const handlePrevClick = () => {
    setPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextClick = () => {
    setPage((prev) => Math.min(prev + 1, totalPages));
  };

  // Fetch players data from API
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await api.get("/contests/participants/"); // Replace with actual API endpoint
        setPlayers(response.data);
        setPlayersChunks(sliceArray(response.data)); // Slice players into chunks for pagination
      } catch (error) {
        console.error("Error fetching players:", error);
      }
    };

    fetchPlayers();
  }, []); // Runs once on component mount

  // Update player chunks whenever the page changes
  useEffect(() => {
    setPlayersChunks(sliceArray(players));
  }, [players, page]);

  return (
    <div style={styles.container}>
      {/* Game Rules Section */}
      <div style={styles.gameRulesSection}>
        <h2 style={styles.rulesTitle}>Game rules</h2>
        <div style={styles.rulesContainer}>
          {rules.map((rule, index) => (
            <div key={index} style={styles.ruleItem}>
              <img style={styles.ruleIcon} src={bluecheck} alt={bluecheck} />
              <div style={styles.ruleContent}>
                <h3 style={styles.ruleHeading}>{rule.title}</h3>
                <p
                  style={{ ...styles.ruleDescription, whiteSpace: "pre-line" }}
                >
                  {rule.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={styles.joinedPlayersSection}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <h2 style={styles.playersTitle}>Joined players</h2>
          <p style={styles.waitingMessage}>Waiting for players to join...</p>
        </div>
        <div style={styles.playersContainer}>
          {playersChunks[page - 1]?.map((player, index) => (
            <div
              key={index}
              style={styles.playerCardIsCurrentMultip(player.username ==localStorage.getItem(USERNAME))}
            >
              <img
                src={"https://via.placeholder.com/96x96"}
                alt={player.username}
                style={styles.playerAvatar}
              />
              <div style={styles.playerUsername}>{player.username}</div>
              <div style={styles.playerStatus(player.username ==localStorage.getItem(USERNAME))}>
                {player.username ==localStorage.getItem(USERNAME)  ? "Ready" : "Joining..."}
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 ? (
          <Pagination
            page={page}
            onPrevClick={handlePrevClick}
            onNextClick={handleNextClick}
            totalPages={totalPages}
          />
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default LobbyMain;
