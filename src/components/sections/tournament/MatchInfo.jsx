import React, { useEffect, useState } from "react";
import api from "../../../context/api";
import getWebSocketUrl from "../../../utils/websocket";
import { USERNAME } from "../../../context/constant";

const MatchInfo = ({ contestId, onStartProblem }) => {
    const [match, setMatch] = useState(null);
    const [loading, setLoading] = useState(true);
    const currentUser = localStorage.getItem(USERNAME);

    useEffect(() => {
        if (!contestId) return;

        // Initial fetch to get current match data immediately
        const fetchMatch = async () => {
            try {
                const response = await api.get(`/contests/${contestId}/match/`);
                if (response.data.success) {
                    setMatch(response.data.data);

                } else {
                    console.error("Failed to fetch match:", response.data.message);
                    setMatch(null);
                }
            } catch (error) {
                console.error("Error fetching match:", error);
                setMatch(null);
            } finally {
                setLoading(false);
            }
        };

        // Fetch initial data
        fetchMatch();

        // Connect to WebSocket for real-time updates
        const wsUrl = getWebSocketUrl(`/ws/contest/${contestId}/`);
        let ws = null;

        try {
            ws = new WebSocket(wsUrl);

            ws.onopen = () => {

            };

            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);


                    // Handle match updates
                    if (data.type === 'match_update') {

                        fetchMatch(); // Refresh match data on update
                    }
                    // Handle tree updates (also refresh match as it may have changed)
                    else if (data.type === 'tree_update') {

                        fetchMatch();
                    }
                    // Silently ignore debug/auth messages
                } catch (error) {
                    console.error("Failed to parse WebSocket message:", error);
                }
            };

            ws.onerror = (error) => {
                console.error("❌ WebSocket error (MatchInfo):", error);
            };

            ws.onclose = (event) => {
                if (event.code !== 1000) {
                    console.warn(`⚠️ WebSocket closed unexpectedly. Code: ${event.code}`);
                }
            };

        } catch (error) {
            console.error("❌ Failed to create WebSocket:", error);
        }

        // Cleanup function
        return () => {
            if (ws && ws.readyState === WebSocket.OPEN) {

                ws.close(1000, "Component unmounting");
            }
        };
    }, [contestId]);

    if (loading) return <div style={{ color: 'white' }}>Loading Match Info...</div>;

    if (!match) {
        return (
            <div style={{ color: 'white', textAlign: 'center', padding: '50px' }}>
                <h2>Waiting for opponent...</h2>
                <p>You don't have an active match right now.</p>
            </div>
        );
    }

    const opponent = match.player1?.username === currentUser ? match.player2 : match.player1;

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '30px',
            padding: '40px',
            background: '#2c2c2c',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '800px',
            margin: '0 auto'
        }}>
            <h2 style={{ color: 'white' }}>Current Match - Round {match.round_number}</h2>

            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#4CAF50', margin: '0 auto 10px' }}></div>
                    <h3 style={{ color: 'white' }}>You</h3>
                </div>

                <div style={{ color: '#FFD60A', fontSize: '24px', fontWeight: 'bold' }}>VS</div>

                <div style={{ textAlign: 'center' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#F44336', margin: '0 auto 10px' }}></div>
                    <h3 style={{ color: 'white' }}>{opponent ? opponent.username : 'Waiting...'}</h3>
                </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <h3 style={{ color: '#E7E7E7' }}>Problem: {match.problem_title || 'Hidden'}</h3>
                {match.problem_title && (
                    <button
                        onClick={() => onStartProblem(match.problem)}
                        style={{
                            marginTop: '20px',
                            padding: '12px 32px',
                            background: '#0A84FF',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '18px',
                            cursor: 'pointer'
                        }}
                    >
                        Start Battle
                    </button>
                )}
            </div>
        </div>
    );
};

export default MatchInfo;
