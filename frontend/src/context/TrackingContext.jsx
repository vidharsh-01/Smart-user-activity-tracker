import React, { createContext, useContext, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import axios from 'axios';

const TrackingContext = createContext();
export const useTracking = () => useContext(TrackingContext);

// Get API base URL from environment variable
const API = import.meta.env.VITE_API_URL;

export const TrackingProvider = ({ children }) => {
    const location = useLocation();
    const { user } = useAuth();
    const sessionStarted = useRef(false);
    const sessionId = useRef(null);
    const lastTrackedPage = useRef(null);

    // Helper to send tracking data
    const trackEvent = useCallback(async (type, data) => {
        if (!user || user.isAdmin) return;
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            await axios.post(`${API}/track/${type}`, { page: location.pathname, ...data }, config);
        } catch (err) {
            console.error('Tracking error:', err);
        }
    }, [user, location.pathname]);

    // Session Tracking
    useEffect(() => {
        if (!user || user.isAdmin || sessionStarted.current) return;

        const startSession = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.post(`${API}/track/session`, { action: 'start' }, config);
                sessionId.current = data._id;
                sessionStarted.current = true;
                console.log('Session started:', sessionId.current);
            } catch (err) {
                console.error('Session start error:', err);
            }
        };

        startSession();

        const handleUnload = () => {
            if (sessionStarted.current && sessionId.current) {
                // Use fetch with keepalive for reliable session end
                fetch(`${API}/track/session`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${user.token}`,
                    },
                    body: JSON.stringify({ action: 'end', sessionId: sessionId.current }),
                    keepalive: true
                });
                sessionStarted.current = false;
            }
        };

        window.addEventListener('beforeunload', handleUnload);
        return () => window.removeEventListener('beforeunload', handleUnload);
    }, [user]);

    // Page View Tracking
    useEffect(() => {
        if (!user || user.isAdmin) return;

        const timer = setTimeout(() => {
            if (lastTrackedPage.current !== location.pathname) {
                trackEvent('page', {});
                lastTrackedPage.current = location.pathname;
            }
        }, 100);

        return () => clearTimeout(timer);
    }, [location.pathname, user, trackEvent]);

    // Scroll Tracking
    useEffect(() => {
        if (!user || user.isAdmin) return;

        let maxScroll = 0;
        const currentPath = location.pathname;

        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (docHeight <= 0) return;
            const scrollPercent = Math.round((scrollTop / docHeight) * 100);
            if (scrollPercent > maxScroll) maxScroll = scrollPercent;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (maxScroll > 0) {
                fetch(`${API}/track/scroll`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${user.token}`,
                    },
                    body: JSON.stringify({ page: currentPath, value: `${maxScroll}%` }),
                    keepalive: true
                });
            }
        };
    }, [location.pathname, user]);

    // Click Tracking Helper
    const trackClick = useCallback((element, value) => {
        trackEvent('click', { element, value });
    }, [trackEvent]);

    return (
        <TrackingContext.Provider value={{ trackClick }}>
            {children}
        </TrackingContext.Provider>
    );
};
