const mongoose = require('mongoose');

const activitySchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        eventType: {
            type: String, // 'click', 'pageView', 'scroll', 'session'
            required: true,
        },
        page: {
            type: String,
            required: true,
        },
        element: {
            type: String,
        },
        value: {
            type: String,
        },
        timestamp: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;
