import React from "react";
import "./codeEditor/elemnts/ControlButtons.css";
import side from "../../assets/icons/side.svg";


function LeaderHUD({infHUD = 0}) {
  return (
    <div
      style={{
        display: "flex",
        width: "1440px",
        padding: "16px 64px",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "24px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          flex: "1 0 0",
        }}
      >
        
        <p
          style={{
            color: "var(--White, #FFF)",
            fontFamily: "Inter",
            fontSize: "24px",
            fontStyle: "normal",
            fontWeight: "600",
            lineHeight: "32px",
          }}
        >
          Competitive Programming Leaderboard
        </p>
      </div>

      <p
        style={{
          color: "var(--White, #FFF)",
          textAlign: "right",
          fontFamily: "Inter",
          fontSize: "24px",
          fontStyle: "normal",
          fontWeight: "600",
          flex: "1 0 0",
          lineHeight: "32px; ",
        }}
      >
        Day {infHUD}
      </p>
    </div>
  );
}
export default LeaderHUD;
