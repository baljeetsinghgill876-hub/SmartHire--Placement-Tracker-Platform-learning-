const { ObjectId } = require("mongodb");
const { isValidObjectId } = require("../utils/validation");
const { redisClient } = require("../redis");
const { getIO } = require("../socket");

function applicationController(db) {

   const applyForJob = async (req, res) => {
    try {

        const { jobId } = req.body;
        const studentId = req.user.studentId;

        if (!jobId) {
            return res.status(400).json({
                message: "Job ID is required"
            });
        }

        if (!isValidObjectId(jobId)) {
            return res.status(400).json({
                message: "Invalid job ID"
            });
        }

        const student = await db.collection("students").findOne({
            _id: new ObjectId(studentId)
        });

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        const job = await db.collection("jobs").findOne({
            _id: new ObjectId(jobId)
        });

        if (!job) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        // Check if student already applied
        const existingApplication = await db.collection("applications").findOne({
            studentId: new ObjectId(studentId),
            jobId: new ObjectId(jobId)
        });

        if (existingApplication) {
            return res.status(400).json({
                message: "You have already applied for this job"
            });
        }

        // Create application
        const application = {
            studentId: new ObjectId(studentId),
            jobId: new ObjectId(jobId),
            status: "Applied",
            appliedAt: new Date()
        };

        await db.collection("applications").insertOne(application);

        res.status(201).json({
            message: "Application submitted successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to apply for job"
        });
    }
};

    const updateStatus = async (req, res) => {

        
        try {
            const applicationId = req.params.id;
            const newStatus = req.body.status;
            const io = getIO();
            if (!isValidObjectId(applicationId)) {
            return res.status(400).json({
            message: "Invalid application ID"
    });
}

            const allowedStatuses = [
                "Applied",
                "Shortlisted",
                "Interview",
                "Selected",
                "Rejected"
            ];

            if (!allowedStatuses.includes(newStatus)) {
                return res.status(400).json({
                    message: "Invalid application status"
                });
            }

            const application = await db.collection("applications")
            .findOne({
                _id: new ObjectId(applicationId)
            });

            if(!application){
                return res.status(404).json({
                    message: "application not found"
                });
            }

            const job = await db.collection("jobs").findOne({
                _id: application.jobId,
                recruiterId: new ObjectId(req.user.studentId)
            });


        if (!job) {
            return res.status(403).json({
                message: "You are not allowed to update this application"
            });
        }


        // Update status
        await db.collection("applications").updateOne(
            {
                _id: new ObjectId(applicationId)
            },
            {
                $set: {
                    status: newStatus
                }
            }
        );
        console.log(
    "Sending notification to:",
    `student:${application.studentId.toString()}`
);

       const room = `student:${application.studentId.toString()}`;

console.log("Sending notification to:", room);

const socketsInRoom = io.sockets.adapter.rooms.get(room);

console.log(
    "Sockets in student room:",
    socketsInRoom ? [...socketsInRoom] : []
);

io.to(room).emit(
    "application-status-updated",
    {
        message: `Your application for ${job.role} at ${job.company} is now ${newStatus}`,
        status: newStatus,
        jobId: application.jobId.toString()
    }
);

        res.json({
            message: "Application status updated",
            status: newStatus
        });

           
        } catch (error) {
            console.error(error);

            res.status(500).json({
                message: "Failed to update application status"
            });
        }
    };


    const getEligibleJobs = async (req, res) => {
        try {
            const studentId = req.user.studentId;

             const cacheKey = `eligibleJobs:${studentId}`;

        const cachedJobs = await redisClient.get(cacheKey);

        if (cachedJobs) {
            return res.json(JSON.parse(cachedJobs));
        }
  
           
            if (!isValidObjectId(studentId)) {
             return res.status(400).json({
        message: "Invalid student ID"
    });
}

            const student = await db.collection("students")
                .findOne({
                    _id: new ObjectId(studentId)
                });

            if (!student) {
                return res.status(404).json({
                    message: "Student not found"
                });
            }

            const jobs = await db.collection("jobs")
                .find({
                    minCGPA: { $lte: student.cgpa }
                })
                .toArray();

            const eligibleJobs = jobs.filter(job => {

                return job.skills.every(skill =>
                    student.skills.includes(skill)
                );

            });

            await redisClient.set(
             cacheKey,
            JSON.stringify(eligibleJobs),
             {
                EX: 300
             }
             );

           res.json(eligibleJobs);

        } catch (error) {
            console.error(error);

            res.status(500).json({
                message: "Failed to find eligible jobs"
            });
        }
    };


    const getStudentApplications = async (req, res) => {
    try {
        const studentId = req.user.studentId;

        if (!isValidObjectId(studentId)) {
            return res.status(400).json({
                message: "Invalid student ID"
            });
        }

        const applications = await db.collection("applications")
            .aggregate([
                {
                    $match: {
                        studentId: new ObjectId(studentId)
                    }
                },
                {
                    $lookup: {
                        from: "jobs",
                        localField: "jobId",
                        foreignField: "_id",
                        as: "job"
                    }
                },
                {
                    $unwind: "$job"
                },
                {
                    $project: {
                        _id: 1,
                        status: 1,
                        appliedAt:1,
                        "job.company": 1,
                        "job.role": 1,
                        "job.package": 1,
                        "job.location": 1
                    }
                }
            ])
            .toArray();

        res.json(applications);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch applications"
        });
    }
};

  return {
    applyForJob,
    updateStatus,
    getEligibleJobs,
    getStudentApplications
};
}

module.exports = applicationController;