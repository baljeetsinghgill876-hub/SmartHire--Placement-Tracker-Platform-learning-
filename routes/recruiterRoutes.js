const express = require("express");

const authMiddleware =
    require("../middleware/authMiddleware");

const roleMiddleware =
    require("../middleware/roleMiddleware");

const recruiterController =
    require("../controllers/recruiterController");

function recruiterRoutes(db) {

    const router = express.Router();

    const controller = recruiterController(db);

    router.post(
        "/jobs",
        authMiddleware,
        roleMiddleware("recruiter"),
        controller.createJob
    );

    router.get(
    "/jobs/:jobId/applicants",
    authMiddleware,
    roleMiddleware("recruiter"),
    controller.getApplicants
);

router.get("/jobs" , authMiddleware, roleMiddleware("recruiter"), controller.getMyJobs);

router.put("/jobs/:jobId" , authMiddleware, roleMiddleware("recruiter") , controller.updateJob);

router.delete(
    "/jobs/:jobId",
    authMiddleware,
    roleMiddleware("recruiter"),
    controller.deleteJob
);

    return router;
}

module.exports = recruiterRoutes;