const mongoose = require('mongoose');

const sessionSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        startTime: {
            type: Date,
            required: true,
        },
        endTime: {
            type: Date,
        },
        duration: {
            type: Number, // In seconds
            default: 0,
        },
        device: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;
