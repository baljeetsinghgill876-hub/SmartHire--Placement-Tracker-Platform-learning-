const { ObjectId } = require("mongodb");

function isValidObjectId(id) {
    return ObjectId.isValid(id);
}

function isValidStudent(student) {

    if (!student.name || typeof student.name !== "string") {
        return false;
    }

    if (
        typeof student.cgpa !== "number" ||
        student.cgpa < 0 ||
        student.cgpa > 10
    ) {
        return false;
    }

    if (!Array.isArray(student.skills)) {
        return false;
    }

    return true;
}

function isValidJob(job) {

    if (!job.company || typeof job.company !== "string") {
        return false;
    }

    if (!job.role || typeof job.role !== "string") {
        return false;
    }

    if (
        typeof job.minCGPA !== "number" ||
        job.minCGPA < 0 ||
        job.minCGPA > 10
    ) {
        return false;
    }

    if (!Array.isArray(job.skills)) {
        return false;
    }

    return true;
}

module.exports = {
    isValidObjectId,
    isValidStudent,
    isValidJob
};