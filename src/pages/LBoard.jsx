import React from "react";
import LeaderHUD from "../components/sections/LeaderHUD.jsx";
import PlayersSection from "../components/sections/PlayersSection.jsx";

const GameRoundStyle = {
  display: "flex",
  width: "1440px",
  padding: "16px 64px",
  flexDirection: "column",
  justifyContent: "space-between",
  alignItems: "center",
};
const LBoard = ({ players = [{}, {}, {}, {}], Day = -1 }) => {
  return (
    <div style={GameRoundStyle}>
      <LeaderHUD infHUD={Day} />
      <PlayersSection players={players} infHUD={Day} />
    </div>
  );
};

export default LBoard;
