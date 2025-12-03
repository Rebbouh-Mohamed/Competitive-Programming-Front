import React, { createContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

export const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
    const dispatch = useDispatch();
    const [ws, setWs] = useState(null);

    useEffect(() => {
        let socket;
        try {
            const socketUrl = `ws://localhost:8000/ws/submission/`;
            socket = new WebSocket(socketUrl);

            socket.onopen = () => {
                console.log("WebSocket Connected");
            };

            socket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                console.log("WebSocket Message:", data);

                if (data.type === "submission_update") {
                    dispatch({ type: "problems/updateStatus", payload: data.payload });
                }
            };

            socket.onclose = () => {
                console.log("WebSocket Disconnected");
            };

            setWs(socket);
        } catch (e) {
            console.error("WebSocket connection failed", e);
        }

        return () => {
            if (socket) {
                socket.close();
            }
        };
    }, [dispatch]);

    return (
        <WebSocketContext.Provider value={ws}>
            {children}
        </WebSocketContext.Provider>
    );
};
