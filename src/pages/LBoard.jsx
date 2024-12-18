import React, { useState ,useEffect} from "react";
import LeaderHUD from "../components/sections/LeaderHUD.jsx";
import PlayersSection from "../components/sections/PlayersSection.jsx";
import { lboard } from "../../redux/board/action.js";
import { useDispatch } from "react-redux"; // Import useDispatch for Redux

const GameRoundStyle = {
  display: "flex",
  width: "1440px",
  padding: "16px 64px",
  flexDirection: "column",
  justifyContent: "space-between",
  alignItems: "center",
};

const LBoard = () => {
  const [players, setplayers] =useState([]);
  const[day,setday]=useState("ITCP")
  const dispatch=useDispatch()

  useEffect(() => {
    dispatch(lboard())
      .unwrap()
      .then((data) => {
        setday(data.contest?.name || "-1"); // Use optional chaining for safety
        setplayers(data.leaderboard || []); // Default to empty array if undefined
        console.log("Fetched data:", Object.keys(data));
      })
      .catch((err) => {
        console.error("Error fetching leaderboard:", err);
      });
  }, [dispatch]); 


  return (
    <div style={GameRoundStyle}>
      <LeaderHUD infHUD={day} />
      <PlayersSection players={players} infHUD={day} />
    </div>
  );
};

export default LBoard;
