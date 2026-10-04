const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

function authController(db) {

    const register = async (req, res) => {

        try {

            const { name, email, password ,role} = req.body;

            // Validate input
            if (!name || !email || !password) {
                return res.status(400).json({
                    message: "Name, email and password are required"
                });
            }

            const allowedRoles = ["student" , "recruiter"];
            if(!allowedRoles.includes(role)){
                return res.status(400).json({
                    message: "Invalid role"
                });
            }

            // Check if user already exists
            const existingUser =
                await db.collection("students").findOne({
                    email: email
                });

            if (existingUser) {
                return res.status(400).json({
                    message: "Email already registered"
                });
            }

            // Hash password
            const hashedPassword =
                await bcrypt.hash(password, 10);

            // Create student
            const student = {
                name: name,
                email: email,
                password: hashedPassword,
                cgpa: 0,
                skills: [],
                role : role
            };

            const result =
                await db.collection("students")
                    .insertOne(student);

            res.status(201).json({
                message: "Registration successful",
                id: result.insertedId
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message: "Registration failed"
            });
        }
    };

    const login = async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const student =
            await db.collection("students").findOne({
                email: email
            });

        if (!student) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const passwordMatch =
            await bcrypt.compare(
                password,
                student.password
            );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            {
                studentId: student._id,
                role: student.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );

        res.json({
            message: "Login successful",
            token: token
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Login failed"
        });
    }
};

    return {
        register,
        login
    };
}

module.exports = authController;