const { ObjectId } = require("mongodb");
const { isValidStudent } = require("../utils/validation");

function studentController(db) {

    const getStudents = async (req, res) => {

    try {

        const students = await db.collection("students")
            .find()
            .toArray();

        res.json(students);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to fetch students"
        });
    }
};


   const addStudent = async (req, res) => {

    try {

        const student = req.body;
        if (!isValidStudent(student)) {
    return res.status(400).json({
        message: "Invalid student data"
    });
}

        const result = await db.collection("students")
            .insertOne(student);

        res.status(201).json({
            message: "Student added successfully",
            id: result.insertedId
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to add student"
        });
    }
};

    const updateStudent = async (req, res) => {

    try {

        const id = req.params.id;

        const result = await db.collection("students")
            .updateOne(
                { _id: new ObjectId(id) },
                { $set: req.body }
            );

        res.json({
            message: "Student updated successfully",
            modifiedCount: result.modifiedCount
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to update student"
        });
    }
};

    const deleteStudent = async (req, res) => {

    try {

        const id = req.params.id;

        const result = await db.collection("students")
            .deleteOne({
                _id: new ObjectId(id)
            });

        res.json({
            message: "Student deleted successfully",
            deletedCount: result.deletedCount
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to delete student"
        });
    }
};


    return {
        getStudents,
        addStudent,
        updateStudent,
        deleteStudent
    };
}

module.exports = studentController;