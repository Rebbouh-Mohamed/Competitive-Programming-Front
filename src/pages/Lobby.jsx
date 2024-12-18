import React, { useEffect, useState } from "react";
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

  const [Contest, setContest] = useState(null); // State for contest data

  // Debounced fetching function (optional)
  const debouncedGetUpcomingContest = _.debounce(() => {
    if (!isLoading && !upcomingContest) {
      dispatch(getUpcomingContest());
    }
  }, 300);

  useEffect(() => {
    // Call debounced function to fetch contest data
    debouncedGetUpcomingContest();

    // Set the contest data once fetched
    if (upcomingContest) {
      setContest(upcomingContest);
    }

    // Cleanup debounce on unmount
    return () => debouncedGetUpcomingContest.cancel();
  }, [debouncedGetUpcomingContest, dispatch, upcomingContest, isLoading]);

  // Error handling
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      {isLoading ? (
        <div>Loading...</div> // Show loading indicator
      ) : (
        <>
          <LobbyHeader Contest={Contest?.data} />
          <LobbyMain Contest={Contest?.data} />
        </>
      )}
    </>
  );
};

export default Lobby;
