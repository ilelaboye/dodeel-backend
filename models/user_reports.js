const mongoose = require('mongoose');

const user_reportSchema = new mongoose.Schema({
    report_id: {
        type: mongoose.Types.ObjectId,
        ref: "reports"
    },
    user_id: {
        type: mongoose.Types.ObjectId,
        ref: "users"
    }
}, {
    timestamps: true
});

const user_report = mongoose.model('user_reports', user_reportSchema);

module.exports = user_report

