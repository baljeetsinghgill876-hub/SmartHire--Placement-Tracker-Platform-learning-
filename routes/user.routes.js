const express = require("express");
const { ObjectId } = require("mongodb");
const connectDB = require("../db");
const authMiddleware = require("../middleware/authMiddleware")
const router = express.Router();

router.get("/", (req, res) => {
    res.json({
        message: "get all users"
    });
});
router.get("/profile", authMiddleware, async (req, res) => {

    try {

        const db = await connectDB();

        const student = await db.collection("students").findOne(
            {
                _id: new ObjectId(req.user.studentId)
            },
            {
                projection: {
                    password: 0
                }
            }
        );

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.json(student);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});

router.get("/:id", async (req, res) => {

    try {

        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: "Invalid user ID"
            });
        }

        const db = await connectDB();

        const user = await db.collection("students").findOne({
            _id: new ObjectId(req.params.id)
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json(user);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});
router.patch("/profile", authMiddleware, async (req, res) => {

    try {

        const updates = {};

        if (req.body.name !== undefined) {
            updates.name = req.body.name;
        }

        if (req.body.cgpa !== undefined) {

            if (req.body.cgpa < 0 || req.body.cgpa > 10) {
                return res.status(400).json({
                    message: "CGPA must be between 0 and 10"
                });
            }

            updates.cgpa = Number(req.body.cgpa);
        }

        if (req.body.skills !== undefined) {

            if (!Array.isArray(req.body.skills)) {
                return res.status(400).json({
                    message: "Skills must be an array"
                });
            }

            updates.skills = req.body.skills;
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                message: "No fields to update"
            });
        }

        const db = await connectDB();

        const result = await db.collection("students").updateOne(
            {
                _id: new ObjectId(req.user.studentId)
            },
            {
                $set: updates
            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json({
            message: "Profile updated successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});

module.exports = router;