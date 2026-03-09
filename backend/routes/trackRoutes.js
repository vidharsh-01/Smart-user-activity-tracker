const express = require('express');
const router = express.Router();
const Activity = require('../models/activityModel');
const Session = require('../models/sessionModel');
const { protect } = require('../middleware/authMiddleware');

// @desc    Track page view
// @route   POST /api/track/page
// @access  Private
router.post('/page', protect, async (req, res) => {
    const { page } = req.body;

    const activity = await Activity.create({
        userId: req.user._id,
        eventType: 'pageView',
        page,
    });

    res.status(201).json(activity);
});

// @desc    Track click event
// @route   POST /api/track/click
// @access  Private
router.post('/click', protect, async (req, res) => {
    const { page, element, value } = req.body;

    const activity = await Activity.create({
        userId: req.user._id,
        eventType: 'click',
        page,
        element,
        value,
    });

    res.status(201).json(activity);
});

// @desc    Track scroll depth
// @route   POST /api/track/scroll
// @access  Private
router.post('/scroll', protect, async (req, res) => {
    const { page, value } = req.body;

    // We might want to only log max scroll per page to avoid spamming
    const activity = await Activity.create({
        userId: req.user._id,
        eventType: 'scroll',
        page,
        value, // percentage
    });

    res.status(201).json(activity);
});

// @desc    Manage session
// @route   POST /api/track/session
// @access  Private
router.post('/session', protect, async (req, res) => {
    const { sessionId, action } = req.body; // action: 'start' or 'end'

    if (action === 'start') {
        const session = await Session.create({
            userId: req.user._id,
            startTime: new Date(),
            device: req.headers['user-agent'],
        });
        res.status(201).json(session);
    } else if (action === 'end' && sessionId) {
        const session = await Session.findById(sessionId);
        if (session) {
            session.endTime = new Date();
            session.duration = Math.round((session.endTime - session.startTime) / 1000);
            await session.save();
            res.json(session);
        } else {
            res.status(404).json({ message: 'Session not found' });
        }
    }
});

module.exports = router;
