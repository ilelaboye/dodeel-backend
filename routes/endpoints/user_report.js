const Report = require('../../models/user_reports');
const { auth } = require("../middlewares/loggedIn");
const User = require("../../models/user");
const { tokenCallback } = require('../../functions/token');

const { verifyToken } = tokenCallback()

let routes = (app) => {
    app.post('/user_report', async (req, res) => {
        try {
            
            let user_report = new Report(req.body);
            await user_report.save()
            res.json(user_report)
        }
        catch (err) {
            res.status(500).send(err)
        }
    });

  
    // get all user_reports
    app.get('/user_reports', async (req, res) => {
        try {

            let user_reports = await Report.find().sort({ createdAt: -1 })
                .populate("report_id")
               
            res.json(user_reports)
        }
        catch (err) {
            res.status(400).send(err)
        }
    });

    app.get('/user_report/:id', async (req, res) => {
        try {
            let user_reports = await Report.find({ _id: req.params.id })
                .populate("report_id")
            res.json(user_reports)
        }
        catch (err) {
            res.status(500).send(err)
        }
    });

    app.delete('/user_report/:id', async (req, res) => {
        try {
            await Report.deleteOne({ _id: req.params.id })
            res.json({ msg: "Report Deleted" })
        }
        catch (err) {
            res.status(500).send(err)
        }
    });

};

module.exports = routes;