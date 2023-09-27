const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    expired: { type: Number, required: true },
}, {
    timestamps: true
});

const report = mongoose.model('reports', reportSchema);

module.exports = report

