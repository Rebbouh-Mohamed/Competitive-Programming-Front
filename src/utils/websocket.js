// WebSocket URL helper
// Gets the WebSocket URL based on the API base URL from environment variables

const getWebSocketUrl = (path) => {
    // Get the API URL from environment (e.g., http://localhost:8000)
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';

    // Parse the URL to get host and protocol
    const url = new URL(apiUrl);
    const host = url.host; // e.g., localhost:8000

    // Determine WebSocket protocol based on HTTP protocol
    const wsProtocol = url.protocol === 'https:' ? 'wss:' : 'ws:';

    // Ensure path starts with /
    const wsPath = path.startsWith('/') ? path : `/${path}`;

    return `${wsProtocol}//${host}${wsPath}`;
};

export default getWebSocketUrl;
