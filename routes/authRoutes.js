const express = require("express");

const router = express.Router();

const authController =
    require("../controllers/authController");

function authRoutes(db) {

    const controller = authController(db);

    router.post("/register", controller.register);

    router.post("/login", controller.login);

    return router;
}

module.exports = authRoutes;