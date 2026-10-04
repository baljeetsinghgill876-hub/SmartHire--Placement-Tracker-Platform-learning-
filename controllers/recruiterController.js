const { ObjectId } = require("mongodb");
const { redisClient } = require("../redis");

function recruiterController(db) {

    const createJob = async (req, res) => {
        try {

            const {
                company,
                role,
                package: salaryPackage,
                location,
                minCGPA,
                skills
            } = req.body;

            if (!company || !role || !location) {
                return res.status(400).json({
                    message: "Company, role and location are required"
                });
            }

            if (
                typeof minCGPA !== "number" ||
                minCGPA < 0 ||
                minCGPA > 10
            ) {
                return res.status(400).json({
                    message: "Invalid minimum CGPA"
                });
            }

            if (!Array.isArray(skills)) {
                return res.status(400).json({
                    message: "Skills must be an array"
                });
            }

            const job = {
                company,
                role,
                package: salaryPackage,
                location,
                minCGPA,
                skills,
                recruiterId: new ObjectId(req.user.studentId),
                createdAt: new Date()
            };

            const result = await db
                .collection("jobs")
                .insertOne(job);
            const keys = await redisClient.keys("eligibleJobs:*");

             if (keys.length > 0) {
             await redisClient.del(keys);
             }    

            res.status(201).json({
                message: "Job created successfully",
                jobId: result.insertedId
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message: "Failed to create job"
            });
        }
    };

    const getApplicants = async (req, res) => {
    try {

        const jobId = req.params.jobId;

        if (!ObjectId.isValid(jobId)) {
            return res.status(400).json({
                message: "Invalid job ID"
            });
        }

        const job = await db.collection("jobs").findOne({
            _id: new ObjectId(jobId),
            recruiterId: new ObjectId(req.user.studentId)
        });

        if (!job) {
            return res.status(404).json({
                message: "Job not found or access denied"
            });
        }

        const applicants = await db.collection("applications")
            .aggregate([
                {
                    $match: {
                        jobId: new ObjectId(jobId)
                    }
                },
                {
                    $lookup: {
                        from: "students",
                        localField: "studentId",
                        foreignField: "_id",
                        as: "student"
                    }
                },
                {
                    $unwind: "$student"
                },
                {
                    $project: {
                        _id: 1,
                        status: 1,
                        "student._id": 1,
                        "student.name": 1,
                        "student.email": 1,
                        "student.cgpa": 1,
                        "student.skills": 1
                    }
                }
            ])
            .toArray();

        res.json(applicants);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to fetch applicants"
        });
    }
};

const getMyJobs = async (req, res) => {
    try {
         
        const recruiterId = new ObjectId(req.user.studentId);

        const jobs = await db.collection("jobs").find({

            recruiterId: recruiterId
        }).sort({
            createdAt:-1
        }).toArray();

        res.json(jobs);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to fetch jobs"
        });
    }
};

const updateJob = async (req, res) => {
    try {
        const jobId = req.params.jobId;

        if (!ObjectId.isValid(jobId)) {
            return res.status(400).json({
                message: "Invalid job ID"
            });
        }

        const {
            company,
            role,
            package: salaryPackage,
            location,
            minCGPA,
            skills
        } = req.body;

        if (!company || !role || !location) {
            return res.status(400).json({
                message: "Company, role and location are required"
            });
        }

        if (
            typeof minCGPA !== "number" ||
            minCGPA < 0 ||
            minCGPA > 10
        ) {
            return res.status(400).json({
                message: "Invalid CGPA"
            });
        }

        if (!Array.isArray(skills)) {
            return res.status(400).json({
                message: "Skills must be an array"
            });
        }

        const job = await db.collection("jobs").findOne({
            _id: new ObjectId(jobId),
            recruiterId: new ObjectId(req.user.studentId)
        });

        if (!job) {
            return res.status(404).json({
                message: "Job not found or access denied"
            });
        }

        await db.collection("jobs").updateOne(
            {
                _id: new ObjectId(jobId),
                recruiterId: new ObjectId(req.user.studentId)
            },
            {
                $set: {
                    company,
                    role,
                    package: salaryPackage,
                    location,
                    minCGPA,
                    skills,
                    updatedAt: new Date()
                }
            }
        );

        res.json({
            message: "Job updated successfully"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to update job"
        });
    }
};
const deleteJob = async (req, res) => {
    try {
        const { jobId } = req.params;

        if (!ObjectId.isValid(jobId)) {
            return res.status(400).json({
                message: "Invalid job ID"
            });
        }

        // Check whether this job belongs to the recruiter
        const job = await db.collection("jobs").findOne({
            _id: new ObjectId(jobId),
            recruiterId: new ObjectId(req.user.studentId)
        });

        if (!job) {
            return res.status(404).json({
                message: "Job not found or access denied"
            });
        }

        // Check whether students have applied
        const application = await db.collection("applications").findOne({
            jobId: new ObjectId(jobId)
        });

        if (application) {
            return res.status(400).json({
                message: "Cannot delete job because students have already applied"
            });
        }

        // Delete the job
        await db.collection("jobs").deleteOne({
            _id: new ObjectId(jobId)
        });

        res.json({
            message: "Job deleted successfully"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to delete job"
        });
    }
};


    return {
        createJob,
        getApplicants,
        getMyJobs,
        updateJob,
        deleteJob
    };
}

module.exports = recruiterController;