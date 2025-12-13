import React, { useState, useEffect } from "react";
import api from "../context/api";
import PrimaryButton from "../components/ui-elements/buttons/PrimaryButton";

const AdminPage = () => {
    const [contests, setContests] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedContest, setSelectedContest] = useState(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchContests();
        fetchUsers();
    }, []);

    const fetchContests = async () => {
        try {
            const response = await api.get("/contests/admin/contests/");
            if (response.data.success) {
                setContests(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching contests:", error);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await api.get("/contests/admin/users/");
            if (response.data.success) {
                setUsers(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const handleAddUser = async (userId) => {
        if (!selectedContest) {
            setMessage("Please select a contest first.");
            return;
        }
        try {
            const response = await api.post("/contests/admin/add-participant/", {
                contest_id: selectedContest.id,
                user_id: userId,
            });
            if (response.data.success) {
                setMessage(response.data.message);
            } else {
                setMessage(response.data.message);
            }
        } catch (error) {
            setMessage("Error adding user: " + (error.response?.data?.message || error.message));
        }
    };

    const handleStartContest = async () => {
        if (!selectedContest) return;
        try {
            const response = await api.post(`/contests/${selectedContest.id}/start/`);
            if (response.data.success) {
                setMessage("Contest started successfully! Bracket generated.");
            } else {
                setMessage("Failed to start: " + response.data.message);
            }
        } catch (error) {
            setMessage("Error starting contest: " + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div style={{ padding: "40px", color: "white", minHeight: "100vh", background: "#1e1e1e" }}>
            <h1>Admin Dashboard</h1>
            {message && <div style={{ padding: "10px", background: "#333", marginBottom: "20px", borderRadius: "5px" }}>{message}</div>}

            <div style={{ display: "flex", gap: "40px" }}>
                {/* Contest Selection */}
                <div style={{ flex: 1 }}>
                    <h2>1. Select Contest</h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        {contests.map((contest) => (
                            <div
                                key={contest.id}
                                onClick={() => setSelectedContest(contest)}
                                style={{
                                    padding: "15px",
                                    background: selectedContest?.id === contest.id ? "#0A84FF" : "#2c2c2c",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    border: "1px solid #444"
                                }}
                            >
                                <h3>{contest.title}</h3>
                                <p>Type: {contest.type}</p>
                                <p>Start: {new Date(contest.start_time).toLocaleString()}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* User Management */}
                <div style={{ flex: 1 }}>
                    <h2>2. Add Participants</h2>
                    <div style={{ maxHeight: "500px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "10px" }}>
                        {users.map((user) => (
                            <div
                                key={user.id}
                                style={{
                                    padding: "10px",
                                    background: "#2c2c2c",
                                    borderRadius: "8px",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center"
                                }}
                            >
                                <span>{user.username} ({user.email})</span>
                                <button
                                    onClick={() => handleAddUser(user.id)}
                                    disabled={!selectedContest}
                                    style={{
                                        padding: "5px 10px",
                                        background: "#32D74B",
                                        border: "none",
                                        borderRadius: "4px",
                                        cursor: "pointer",
                                        color: "black",
                                        fontWeight: "bold"
                                    }}
                                >
                                    Add
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div style={{ flex: 1 }}>
                    <h2>3. Actions</h2>
                    {selectedContest ? (
                        <div style={{ background: "#2c2c2c", padding: "20px", borderRadius: "8px" }}>
                            <h3>Selected: {selectedContest.title}</h3>
                            <p>Ready to start?</p>
                            <PrimaryButton
                                txt="Generate Bracket & Start Contest"
                                onClick={handleStartContest}
                                full
                                disabled={false}
                            />
                        </div>
                    ) : (
                        <p>Select a contest to see actions.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminPage;
