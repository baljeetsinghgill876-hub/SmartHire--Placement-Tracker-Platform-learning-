const express = require("express");

const router = express.Router();

const jobController = require("../controllers/jobController");

function jobRoutes(db) {

    const controller = jobController(db);

    router.get("/", controller.getJobs);

    router.post("/", controller.addJob);

    router.get("/search", controller.searchJobs);

    return router;
}

module.exports = jobRoutes;