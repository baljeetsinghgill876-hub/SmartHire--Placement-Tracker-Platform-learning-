const express = require("express");
const multer = require("multer");
const PdfParse = require("pdf-parse");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const matchResumeWithJob = require("../ai/resumeMatcher");

const { ObjectId } = require("mongodb");

const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

function aiRoutes(db) {

    router.post(
        "/match/:jobId",
        authMiddleware,
        roleMiddleware("student"),
        upload.single("resume"),

        async (req, res) => {

            try {

                const { jobId } = req.params;

                // Check job ID
                if (!ObjectId.isValid(jobId)) {
                    return res.status(400).json({
                        message: "Invalid job ID"
                    });
                }

                // Check resume
                if (!req.file) {
                    return res.status(400).json({
                        message: "Resume PDF is required"
                    });
                }

                // Find job
                const job = await db.collection("jobs").findOne({
                    _id: new ObjectId(jobId)
                });

                if (!job) {
                    return res.status(404).json({
                        message: "Job not found"
                    });
                }

                // Extract text from PDF
                const pdfData = await PdfParse(req.file.buffer);

                const resumeText = pdfData.text;

                if (!resumeText.trim()) {
                    return res.status(400).json({
                        message: "Could not extract text from resume"
                    });
                }

                // Match resume with job
                const result = matchResumeWithJob(
                    resumeText,
                    job
                );

                res.json({
                    message: "Resume analyzed successfully",
                    job: {
                        id: job._id,
                        company: job.company,
                        role: job.role
                    },
                    result
                });

            } catch (error) {

                console.error(error);

                res.status(500).json({
                    message: "Failed to analyze resume"
                });
            }
        }
    );

    return router;
}

module.exports = aiRoutes;