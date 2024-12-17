import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import LobbyHeader from "../components/sections/LobbyHeader.jsx";
import LobbyMain from "../components/sections/LobbyMain.jsx";
import { getUpcomingContest } from "../../redux/contests/action";
import _ from "lodash"; // Import lodash for debouncing

const Lobby = () => {
  const dispatch = useDispatch();
  const { upcomingContest, isLoading, error } = useSelector(
    (state) => state.contests
  );

  const [Contest, setContest] = useState(null); // State for status

  // Create a debounced function using useMemo to avoid recreation on every render
  const debouncedGetUpcomingContest = useMemo(
    () =>
      _.debounce(() => {
        if (!isLoading && !upcomingContest) {
          dispatch(getUpcomingContest());
        }

        if (upcomingContest) {
          setContest(upcomingContest);
        }
      }, 300),
    [dispatch, isLoading, upcomingContest]
  );

  useEffect(() => {
    // Trigger the debounced function
    debouncedGetUpcomingContest();

    // Cleanup debounce on unmount
    return () => debouncedGetUpcomingContest.cancel();
  }, [debouncedGetUpcomingContest]);
  return (
    <>
      <LobbyHeader Contest={Contest?.data} />
      <LobbyMain Contest={Contest?.data}/>
    </>
  );
};

export default Lobby;
