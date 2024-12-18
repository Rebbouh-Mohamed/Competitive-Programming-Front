import React from "react";
import FirstPlaceMD from "../../assets/icons/FirstPlaceMD.svg";
import SecondPlaceMD from "../../assets/icons/SecondPlaceMD.svg";
import ThirdPlaceMD from "../../assets/icons/ThirdPlaceMD.svg";
// PlayerCardHeader Component

const PlayerCardHeader = () => {
  const styles = {
    container: {
      height: 44,
      paddingLeft: 24,
      paddingRight: 24,
      paddingTop: 12,
      paddingBottom: 12,
      borderBottom: "1px rgba(255, 255, 255, 0.16) solid",
      justifyContent: "space-between",
      alignItems: "center",
      display: "inline-flex",
    },
    headerSection: {
      flex: "1 1 0",
      height: 20,
      justifyContent: "flex-start",
      alignItems: "center",
      gap: 64,
      display: "flex",
    },
    headerText: {
      width: 44,
      textAlign: "center",
      color: "#E7E7E7",
      fontSize: 14,
      fontFamily: "Inter",
      fontWeight: "400",
      wordWrap: "break-word",
    },
    playerText: {
      width: 588,
      color: "#E7E7E7",
      fontSize: 14,
      fontFamily: "Inter",
      fontWeight: "400",
      wordWrap: "break-word",
    },
    scoreTimeSection: {
      flex: "1 1 0",
      height: 20,
      justifyContent: "space-between",
      alignItems: "center",
      display: "flex",
    },
    scoreText: {
      flex: "1 1 0",
      textAlign: "center",
      color: "#E7E7E7",
      fontSize: 14,
      fontFamily: "Inter",
      fontWeight: "400",
      wordWrap: "break-word",
    },
  };
  return (
    <div style={styles.container}>
      <div style={styles.headerSection}>
        <div style={styles.headerText}>#</div>
        <div style={styles.playerText}>Player</div>
      </div>
      <div style={styles.scoreTimeSection}>
        <div style={styles.scoreText}>Score</div>
      </div>
    </div>
  );
};

const PlayerCard = ({
  rank,
  avatar = "https://via.placeholder.com/44x44",
  username = "Username",
  status = "Eliminated",
  score = "101",
  highlight = false,
  infHUD = 0,
}) => {
  const styles = {
    container: (highlight) => ({
      height: 68,
      paddingLeft: 24,
      paddingRight: 24,
      paddingTop: 12,
      paddingBottom: 12,
      borderRadius: 8,
      justifyContent: "space-between",
      alignItems: "center",
      display: "inline-flex",
      background: highlight ? "rgba(255, 255, 255, 0.12)" : "transparent",
      border: highlight ? "transparent" : "none", // Focused border color
      outline: highlight ? "2px solid var(--White, #FFF)" : "none", // Focused border color
    }),
    section: {
      flex: "1 1 0",
      height: 44,
      justifyContent: "flex-start",
      alignItems: "center",
      gap: 64,
      display: "flex",
    },
    rankText: {
      width: 44,
      textAlign: "center",
      color: "#E7E7E7",
      fontSize: 16,
      fontFamily: "Inter",
      fontWeight: "500",
      wordWrap: "break-word",
    },
    playerSection: {
      flex: "1 1 0",
      height: 44,
      justifyContent: "flex-start",
      alignItems: "center",
      gap: 12,
      display: "flex",
    },
    avatar: {
      width: 44,
      height: 44,
      borderRadius: "50%",
    },
    playerInfo: {
      flex: "1 1 0",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "flex-start",
      display: "inline-flex",
    },
    username: {
      alignSelf: "stretch",
      color: "white",
      fontSize: 16,
      fontFamily: "Inter",
      fontWeight: "500",
      wordWrap: "break-word",
    },
    status: {
      alignSelf: "stretch",
      color: status == "Eliminated" ? "#FF453A" : "#32D74B",
      fontSize: 14,
      fontFamily: "Inter",
      fontWeight: "400",
      wordWrap: "break-word",
    },
    scoreTimeSection: {
      flex: "1 1 0",
      height: 20,
      justifyContent: "space-between",
      alignItems: "center",
      display: "flex",
    },
    scoreText: {
      flex: "1 1 0",
      textAlign: "center",
      color: "#E7E7E7",
      fontSize: 14,
      fontFamily: "Inter",
      fontWeight: "400",
      wordWrap: "break-word",
    },
  };
  return (
    <div style={styles.container(highlight)}>
      <div style={styles.section}>
        {infHUD == 2 && rank < 4 ? (
          <div
            style={{
              display: "flex",
              width: "32px",
              height: "32px",
              padding: "2px 3.441px 1.999px 3.442px",
              justifyContent: "center",
              alignItems: "center",
              flexShrink: "0",
            }}
          >
            <img
              style={{
                width: "25.117px",
                height: "28px",
                flexShrink: "0",
              }}
              src={
                rank == 1
                  ? FirstPlaceMD
                  : rank == 2
                  ? SecondPlaceMD
                  : ThirdPlaceMD
              }
            />
          </div>
        ) : (
          <div style={styles.rankText}>{rank}</div>
        )}
        <div style={styles.playerSection}>
          <img style={styles.avatar} src={avatar} alt="avatar" />
          <div style={styles.playerInfo}>
            <div style={styles.username}>{username}</div>
            {infHUD == 2 && rank > 3 ? (
              <div
                style={{
                  alignSelf: "stretch",
                  color: "#E7E7E7",
                  fontSize: 14,
                  fontFamily: "Inter",
                  fontWeight: "400",
                  wordWrap: "break-word",
                }}
              >
                Nice try!
              </div>
            ) : (
              <div style={styles.status}>{infHUD == 2 ? "Winner" : status}</div>
            )}
          </div>
        </div>
      </div>
      <div style={styles.scoreTimeSection}>
        <div style={styles.scoreText}>{score} points</div>
      </div>
    </div>
  );
};

// PlayerList Component
const PlayerList = ({ players, infHUD }) => {
  const container = {
    alignSelf: "stretch",
    padding: "12px 0",
    display: "flex",
    flexDirection: "column",
    gap: 12,
  };
  return (
    <div style={container}>
      {players.map((player, index) => (
        <PlayerCard
        key={index}
        rank={index + 1}
        avatar={"https://via.placeholder.com/44x44"}
        username={player?.user?.username || "Unknown"} // Safe access
        status={index <= 20 ? "Qualified" : "Eliminated"} // Fix logic
        score={player?.pionts || 0} // Default to 0 if points is undefined
        highlight={false} // Fix typo
        infHUD={infHUD}
      />
      ))}
    </div>
  );
};

// Main Component
const Leaderboard = ({ players , infHUD }) => {
  const container = {
    width: 1440,
    padding: "32px 64px",
    display: "flex",
    flexDirection: "column",
  };
  return (
    <div style={container}>
      <PlayerCardHeader />
      <PlayerList players={players} infHUD={infHUD} />
    </div>
  );
};

export default Leaderboard;
