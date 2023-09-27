const Report = require('../../models/reports');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const fs = require('fs')
const util = require('util')
const unlinkFile = util.promisify(fs.unlink)
const upload = multer({ dest: 'uploads/' })


const { uploadFile, getFileStream } = require('../../functions/S3')

async function ImageUpload(file) {
    const result = await uploadFile(file)
    return result.Location
}


let routes = (app) => {

  

    app.post('/report', upload.single('image'), async (req, res) => {

            try {
                let report = new Report({ ...req.body });
                await report.save()
                res.json(report)
            }
            catch (err) {
                console.log(err)
                res.status(500).send(err)
            }
       });

    // get report according to categories
    app.get('/reports-by-category', async (req, res) => {
        try {
            let reports = await Report.find({ status: 2, category_id: req.query.category }).sort({ createdAt: -1 })
                .populate("user_id", "firstname lastname role")
                .populate("category_id", "title")
            res.json(reports)
        }
        catch (err) {
            res.status(400).send(err)
        }
    });

    // get all reports
    app.get('/reports', async (req, res) => {
        const page = parseInt(req.query.limit)  - 10 || 0;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || "";

        try {
            let count = await Report.count()
            let reports = await Report.find().skip(page).limit(limit).sort({ createdAt: -1 })
            res.json({ reports, pageNumber: Math.round((count / (limit-page)) + 0.4) })
        }
        catch (err) {
            res.status(400).send(err)
        }
    });

    app.get('/reports/adminAccess', async (req, res) => {
        const page = parseInt(req.query.limit)  - 10 || 0;
        const limit = parseInt(req.query.limit) || 5;
        const search = req.query.search || "";

        try {
            let count = await Report.count()
            let reports = await Report.find(({ itemName: { $regex: search, $options: "i" } })).skip(page).limit(limit).sort({ createdAt: -1 })
                .populate("user_id", "firstname lastname role")
                .populate("category_id", "title")

            res.json({ reports, pageNumber: Math.round((count / (limit-page)) + 0.4) })
        }
        catch (err) {
            res.status(400).send(err)
        }
    });


    // search for all report
    app.get('/reports/search', async (req, res) => {

        const page = parseInt(req.query.page) - 10 || 0;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || "";
        let sort = req.query.sort || "rating";
        let genre = req.query.genre || "All";

        try {
            let reports = await Report.find(({ itemName: { $regex: search, $options: "i" }, status:2}))

            res.json(reports)
        }
        catch (err) {
            res.status(400).send(err)
        }
    });


    
    app.get('/reports/admin/search', async (req, res) => {

        const page = parseInt(req.query.page) - 10 || 0;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || "";
        let sort = req.query.sort || "rating";
        let genre = req.query.genre || "All";

        try {
            let reports = await Report.find(({ itemName: { $regex: search, $options: "i" }}))

            res.json(reports)
        }
        catch (err) {
            res.status(400).send(err)
        }
    });
    // get latest 8 reports
    app.get('/report-8', async (req, res) => {
        try {
            let reports = await Report.find().sort({ createdAt: -1 }).limit(8)
                .populate("user_id", "firstname lastname role")
                .populate("category_id", "title")
            res.json(reports)
        }
        catch (err) {
            res.status(500).send(err)
        }
    });

    app.get('/report/:id', async (req, res) => {
        try {
            let reports = await Report.findOne({ _id: req.params.id })
                .populate("user_id", "firstname lastname").populate("category_id")
            res.json(reports)
        }
        catch (err) {
            res.status(500).send(err)
        }
    });

    app.put('/report/:id', upload.single('image'), async (req, res) => {
        const file = req.file
        if (file) {
            const imageLink = await ImageUpload(file)
            if (imageLink) {
                const update = { ...req.body, image: imageLink }
                try {
                    let report = await Report.updateOne({ _id: req.params.id }, update, { returnOriginal: false });
                    res.json(report)
                }
                catch (err) {
                    console.log(err)
                    res.status(500).send(err)
                }
            } else {
                res.status(305).send("image filed to upload")
            }
        } else {
            try {
                let update = req.body;
                let report = await Report.updateOne({ _id: req.params.id }, update, { returnOriginal: false })
                    .populate("user_id", "firstname lastname")
                return res.json(report)
            }
            catch (err) {
                res.status(500).send(err)
                throw err
            }
        }

    });


    app.put('/report/status/:id', async (req, res) => {

        const update = { ...req.body }
        try {
            let report = await Report.updateOne({ _id: req.params.id }, update, { returnOriginal: false });
            res.json(report)
        }
        catch (err) {
            console.log(err)
            res.status(500).send(err)
        }

    });

    app.delete('/report/:id', async (req, res) => {
        try {
            await Report.deleteOne({_id:req.params.id})
            res.json({ msg: "Report Deleted" })
        }
        catch (err) {
            res.status(500).send(err)
        }
    });

};

module.exports = routes;