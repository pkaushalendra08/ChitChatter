import { createContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [authUser, setAuthUser] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [socket, setSocket] = useState(null);

    // Check if user is authenticated and set user + socket
    const checkAuth = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/auth/check`);
            if (data.success) {
                setAuthUser(data.user);
                connectSocket(data.user);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    // Login / Signup
    const login = async (state, credentials) => {
        try {
            const { data } = await axios.post(
                `${backendUrl}/api/auth/${state}`,
                credentials
            );

            if (data.success) {
                setAuthUser(data.userData);
                connectSocket(data.userData);

                axios.defaults.headers.common["token"] = data.token;
                setToken(data.token);
                localStorage.setItem("token", data.token);

                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    // Logout
    const logout = async () => {
        localStorage.removeItem("token");
        setToken(null);
        setAuthUser(null);
        setOnlineUsers([]);

        axios.defaults.headers.common["token"] = null;

        if (socket) socket.disconnect();
        setSocket(null);

        toast.success("Logged out successfully");
    };

    // Update profile
    const updateProfile = async (body) => {
        try {
            const { data } = await axios.put(
                `${backendUrl}/api/auth/update-profile`,
                body
            );
            if (data.success) {
                setAuthUser(data.user);
                toast.success("Profile Updated Successfully");
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    // Connect socket for real-time online users
    const connectSocket = (user) => {
        if (!user) return;

        // Disconnect existing socket if any
        if (socket) socket.disconnect();

        const newSocket = io(backendUrl, {
            query: { userId: user._id },
            transports: ["websocket"],
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        setSocket(newSocket);

        newSocket.on("getOnlineUsers", (userIds) => setOnlineUsers(userIds));
    };

    // Set token header on page load
    useEffect(() => {
        if (token) axios.defaults.headers.common["token"] = token;
        checkAuth();
    }, []);

    const value = {
        axios,
        authUser,
        onlineUsers,
        socket,
        login,
        logout,
        updateProfile,
        backendUrl,
    };

    return <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>;
};
