import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserProtectWrapper = ({ children }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/auth/me`, {
                    withCredentials: true
                });

                if (res.status === 200) {
                    setAuthenticated(true);
                } else {
                    throw new Error("Not authenticated");
                }
            } catch (error) {
                console.error('Not authenticated:', error);
                navigate('/login'); // ✅ Redirect to login if not authenticated
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [navigate]);

    if (loading) return <p className="text-center mt-20">Checking authentication...</p>;

    return authenticated ? <>{children}</> : null; // ✅ Only render if authenticated
};

export default UserProtectWrapper;
