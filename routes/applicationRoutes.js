const authMiddleware =
    require("../middleware/authMiddleware");
const express = require("express");

const router = express.Router();

const applicationController =
    require("../controllers/applicationController");
const roleMiddleware = require("../middleware/roleMiddleware");

function applicationRoutes(db) {

    const controller = applicationController(db);

    router.post(
    "/",
    authMiddleware,
    controller.applyForJob
);

    router.put("/:id/status",authMiddleware,roleMiddleware("recruiter") ,controller.updateStatus);

    router.get(
    "/student/eligible-jobs",
    authMiddleware,
    controller.getEligibleJobs
);

    router.get(
    "/student",
    authMiddleware,
    controller.getStudentApplications
);


    return router;
}

module.exports = applicationRoutes;