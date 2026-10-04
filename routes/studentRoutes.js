const express = require("express");

const router = express.Router();

const studentController = require("../controllers/studentController");

function studentRoutes(db) {

    const controller = studentController(db);

    router.get("/", controller.getStudents);

    router.post("/", controller.addStudent);

    router.put("/:id", controller.updateStudent);

    router.delete("/:id", controller.deleteStudent);

    return router;
}

module.exports = studentRoutes;