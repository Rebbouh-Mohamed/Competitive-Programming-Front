import React, { useEffect, useState } from "react";
import api from "../../../context/api";
import getWebSocketUrl from "../../../utils/websocket";

const TournamentTree = ({ contestId }) => {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchBracket = async () => {
            try {
                const response = await api.get(`/contests/${contestId}/bracket/`);
                if (response.data.success) {
                    setMatches(response.data.data);
                } else {
                    console.error("Failed to fetch bracket:", response.data.message);
                }
            } catch (error) {
                console.error("Error fetching bracket:", error);
            } finally {
                setLoading(false);
            }
        };

        if (contestId) {
            fetchBracket();

            // Connect to Contest WebSocket
            const wsUrl = getWebSocketUrl(`/ws/contest/${contestId}/`);
            const ws = new WebSocket(wsUrl);

            ws.onopen = () => {
                console.log(`Connected to Contest ${contestId} WebSocket`);
            };

            ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                if (data.type === 'tree_update') {
                    console.log("Tree update received, refetching bracket...");
                    fetchBracket();
                }
            };

            return () => {
                ws.close();
            };
        }
    }, [contestId]);

    if (loading) return <div style={{ color: 'white' }}>Loading Bracket...</div>;

    // Group matches by round
    const rounds = matches.reduce((acc, match) => {
        const round = match.round_number;
        if (!acc[round]) acc[round] = [];
        acc[round].push(match);
        return acc;
    }, {});

    return (
        <div style={{ display: 'flex', gap: '40px', overflowX: 'auto', padding: '20px' }}>
            {Object.keys(rounds).map((roundNum) => (
                <div key={roundNum} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', gap: '20px' }}>
                    <h3 style={{ color: 'white', textAlign: 'center' }}>Round {roundNum}</h3>
                    {rounds[roundNum].map((match) => (
                        <div key={match.id} style={{
                            background: '#414141',
                            padding: '10px',
                            borderRadius: '8px',
                            border: '1px solid #555',
                            minWidth: '150px'
                        }}>
                            <div style={{ color: match.winner?.id === match.player1?.id ? '#32D74B' : 'white' }}>
                                {match.player1?.username || 'TBD'}
                            </div>
                            <div style={{ borderTop: '1px solid #777', margin: '5px 0' }}></div>
                            <div style={{ color: match.winner?.id === match.player2?.id ? '#32D74B' : 'white' }}>
                                {match.player2?.username || 'TBD'}
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default TournamentTree;
