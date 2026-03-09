import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { Users, Eye, MousePointer2, Clock, Filter } from 'lucide-react';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [pageViews, setPageViews] = useState([]);
    const [clickEvents, setClickEvents] = useState([]);
    const [dailyActivity, setDailyActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316'];

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` },
                };

                const [statsRes, viewsRes, clicksRes, activityRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/analytics/stats', config),
                    axios.get('http://localhost:5000/api/analytics/page-views', config),
                    axios.get('http://localhost:5000/api/analytics/click-events', config),
                    axios.get('http://localhost:5000/api/analytics/daily-activity', config)
                ]);

                setStats(statsRes.data);
                setPageViews(viewsRes.data.map(item => {
                    let label = item._id.replace(/^\//, '');
                    if (label === '') label = 'Home';
                    return { name: label, views: item.count };
                }));
                setClickEvents(clicksRes.data.map(item => ({ name: item._id, clicks: item.count })));
                setDailyActivity(activityRes.data.map(item => ({ date: item._id, events: item.count })));

                setLoading(false);
            } catch (err) {
                console.error('Failed to fetch analytics:', err);
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, [user]);

    if (loading) return <div className="loading">Loading Analytics...</div>;

    return (
        <div className="admin-container">
            <header className="admin-header">
                <h2 className="page-title">Analytics Dashboard</h2>
                <div className="admin-actions">
                    <button className="btn-secondary"><Filter size={18} /> Filters</button>
                </div>
            </header>

            {/* Stats Overview */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon"><Eye /></div>
                    <div className="stat-info">
                        <span className="stat-label">Total Page Views</span>
                        <span className="stat-value">{stats?.totalPageViews || 0}</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon"><MousePointer2 /></div>
                    <div className="stat-info">
                        <span className="stat-label">Total Clicks</span>
                        <span className="stat-value">{stats?.totalClicks || 0}</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon"><Users /></div>
                    <div className="stat-info">
                        <span className="stat-label">Total Sessions</span>
                        <span className="stat-value">{stats?.totalSessions || 0}</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon"><Clock /></div>
                    <div className="stat-info">
                        <span className="stat-label">Avg. Session Time</span>
                        <span className="stat-value">{stats?.avgSessionDuration || 0}s</span>
                    </div>
                </div>
            </div>

            <div className="charts-grid">
                {/* User Activity Line Chart */}
                <div className="chart-card">
                    <h3>Daily User Activity</h3>
                    <div className="chart-container-inner">
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={dailyActivity}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="events" stroke="#6366f1" strokeWidth={2} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Most Visited Pages Bar Chart */}
                <div className="chart-card">
                    <h3>Most Visited Pages</h3>
                    <div className="chart-container-inner">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={pageViews}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="views" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Clicks Distribution Pie Chart */}
                <div className="chart-card">
                    <h3>Clicks per Element</h3>
                    <div className="chart-container-inner">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={clickEvents}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="clicks"
                                >
                                    {clickEvents.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Clicked Elements Table */}
                <div className="chart-card">
                    <h3>Recent Interactions</h3>
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Element</th>
                                <th>Clicks</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clickEvents.slice(0, 5).map((item, idx) => (
                                <tr key={idx}>
                                    <td>{item.name}</td>
                                    <td className="font-bold">{item.clicks}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
