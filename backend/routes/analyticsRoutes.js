const express = require('express');
const router = express.Router();
const Activity = require('../models/activityModel');
const Session = require('../models/sessionModel');
const { protect, admin } = require('../middleware/authMiddleware');

// @desc    Get aggregate stats
// @route   GET /api/analytics/stats
// @access  Private/Admin
router.get('/stats', protect, admin, async (req, res) => {
    const totalPageViews = await Activity.countDocuments({ eventType: 'pageView' });
    const totalClicks = await Activity.countDocuments({ eventType: 'click' });
    const totalSessions = await Session.countDocuments();

    const sessions = await Session.find({ duration: { $gt: 0 } });
    const avgSessionDuration = sessions.length > 0
        ? (sessions.reduce((acc, s) => acc + s.duration, 0) / sessions.length).toFixed(2)
        : 0;

    res.json({
        totalPageViews,
        totalClicks,
        totalSessions,
        avgSessionDuration
    });
});

// @desc    Get page views grouped by page
// @route   GET /api/analytics/page-views
// @access  Private/Admin
router.get('/page-views', protect, admin, async (req, res) => {
    const pageViews = await Activity.aggregate([
        { $match: { eventType: 'pageView' } },
        { $group: { _id: '$page', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
    ]);
    res.json(pageViews);
});

// @desc    Get click events grouped by element
// @route   GET /api/analytics/click-events
// @access  Private/Admin
router.get('/click-events', protect, admin, async (req, res) => {
    const clicks = await Activity.aggregate([
        { $match: { eventType: 'click' } },
        { $group: { _id: '$element', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
    ]);
    res.json(clicks);
});

// @desc    Get daily activity for charts
// @route   GET /api/analytics/daily-activity
// @access  Private/Admin
router.get('/daily-activity', protect, admin, async (req, res) => {
    const dailyActivity = await Activity.aggregate([
        {
            $group: {
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
                count: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } },
        { $limit: 7 } // Last 7 days
    ]);
    res.json(dailyActivity);
});

module.exports = router;
