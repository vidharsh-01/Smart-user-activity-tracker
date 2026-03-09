import React, { createContext, useContext, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import axios from 'axios';

const TrackingContext = createContext();

export const useTracking = () => useContext(TrackingContext);

export const TrackingProvider = ({ children }) => {
    const location = useLocation();
    const { user } = useAuth();
    const sessionStarted = useRef(false);
    const sessionId = useRef(null);
    const lastTrackedPage = useRef(null);

    // Helper to send tracking data
    const trackEvent = async (type, data) => {
        if (!user) return;
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            await axios.post(`http://localhost:5000/api/track/${type}`, {
                page: location.pathname,
                ...data
            }, config);
        } catch (err) {
            console.error('Tracking error:', err);
        }
    };

    // Session Tracking
    useEffect(() => {
        if (user && !sessionStarted.current) {
            const startSession = async () => {
                try {
                    const config = {
                        headers: {
                            Authorization: `Bearer ${user.token}`,
                        },
                    };
                    const { data } = await axios.post('http://localhost:5000/api/track/session', {
                        action: 'start'
                    }, config);
                    sessionId.current = data._id;
                    sessionStarted.current = true;
                    console.log('Session started:', sessionId.current);
                } catch (err) {
                    console.error('Session start error:', err);
                }
            };
            startSession();

            return () => {
                if (sessionStarted.current && sessionId.current) {
                    axios.post('http://localhost:5000/api/track/session', {
                        action: 'end',
                        sessionId: sessionId.current
                    }, {
                        headers: { Authorization: `Bearer ${user.token}` }
                    }).catch(err => console.error('Session end error:', err));
                    sessionStarted.current = false;
                }
            };
        }
    }, [user]);

    // Page View Tracking
    useEffect(() => {
        if (!user) return;

        // Use a small timeout to debounce rapid transitions or StrictMode double-invocations
        const timer = setTimeout(() => {
            if (lastTrackedPage.current !== location.pathname) {
                trackEvent('page', {});
                lastTrackedPage.current = location.pathname;
            }
        }, 100);

        return () => clearTimeout(timer);
    }, [location.pathname, user]);

    // Scroll Tracking
    useEffect(() => {
        if (!user) return;

        let maxScroll = 0;
        const currentPath = location.pathname;

        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (docHeight <= 0) return;

            const scrollPercent = Math.round((scrollTop / docHeight) * 100);
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (maxScroll > 0) {
                // Use a separate track function to capture the page where scroll happened
                // since location.pathname might have already changed on unmount logic
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                axios.post(`http://localhost:5000/api/track/scroll`, {
                    page: currentPath,
                    value: `${maxScroll}%`
                }, config).catch(err => console.error('Scroll track error:', err));
            }
        };
    }, [location.pathname, user]);

    // Click Tracking Helper
    const trackClick = (element, value) => {
        trackEvent('click', { element, value });
    };

    return (
        <TrackingContext.Provider value={{ trackClick }}>
            {children}
        </TrackingContext.Provider>
    );
};
