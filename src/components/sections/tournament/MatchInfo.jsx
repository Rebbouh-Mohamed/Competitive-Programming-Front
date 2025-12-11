import React, { useEffect, useState } from "react";
import api from "../../../context/api";
import { USERNAME } from "../../../context/constant";

const MatchInfo = ({ contestId, onStartProblem }) => {
    const [match, setMatch] = useState(null);
    const [loading, setLoading] = useState(true);
    const currentUser = localStorage.getItem(USERNAME);

    useEffect(() => {
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
            } finally {
                setLoading(false);
            }
        };

        if (contestId) {
            fetchMatch();
            // Poll for updates every 10 seconds
            const interval = setInterval(fetchMatch, 10000);
            return () => clearInterval(interval);
        }
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
