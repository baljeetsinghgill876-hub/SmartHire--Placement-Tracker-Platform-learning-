const { isValidJob } = require("../utils/validation");
const jobController = (db) => {

    const getJobs = async (req, res) => {
        try {
            const jobs = await db.collection("jobs")
                .find()
                .toArray();

            res.json(jobs);

        } catch (error) {
            console.error(error);

            res.status(500).json({
                message: "Failed to fetch jobs"
            });
        }
    };


    const addJob = async (req, res) => {
        try {
            const job = req.body;
            if (!isValidJob(job)) {
            return res.status(400).json({
                message: "Invalid job data"
            });
        }

            const result = await db.collection("jobs")
                .insertOne(job);

            res.status(201).json({
                message: "Job added successfully",
                id: result.insertedId
            });

        } catch (error) {
            console.error(error);

            res.status(500).json({
                message: "Failed to add job"
            });
        }
    };


    const searchJobs = async (req, res) => {
        try {
            const minCGPA = Number(req.query.minCGPA);

            const jobs = await db.collection("jobs")
                .find({
                    minCGPA: { $lte: minCGPA }
                })
                .toArray();

            res.json(jobs);

        } catch (error) {
            console.error(error);

            res.status(500).json({
                message: "Failed to search jobs"
            });
        }
    };


    return {
        getJobs,
        addJob,
        searchJobs
    };
};

module.exports = jobController;