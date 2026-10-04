import { useEffect, useState } from "react";
import API from "./api";
import { Link } from "react-router-dom";
import socket from "./socket";
import "./StudentDashboard.css";

function StudentDashboard() {

    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);

    useEffect(() => {


       const token = localStorage.getItem("token");

if (token) {

    const payload =
        JSON.parse(atob(token.split(".")[1]));

    socket.on("connect", () => {

        console.log(
            "Student socket connected:",
            socket.id
        );

        socket.emit(
            "student-online",
            payload.studentId
        );
    });

    socket.on("application-status-updated", (data) => {

        console.log(
            "Notification received:",
            data
        );

        alert(data.message);
    });

    socket.connect();
}

        API.get("/applications/student/eligible-jobs")
            .then((response) => {
                setJobs(response.data);
            })
            .catch((error) => {
                console.error("Jobs error:", error);
            });

        API.get("/applications/student")
            .then((response) => {
                setApplications(response.data);
            })
            .catch((error) => {
                console.error("Applications error:", error);
            });

    }, []);

    const handleApply = async (jobId) => {

    try {

        const response = await API.post("/applications", {
            jobId:jobId
        });

        alert(response.data.message);

    } catch (error) {

        alert(
            error.response?.data?.message ||
            "Failed to apply"
        );
    }
};


    return (
        <div className="dashboard">

            <div className="navbar">
               

    <h1>SmartHire</h1>

    <div className="nav-links">

        <Link to="/student/profile">
            My Profile
        </Link>

        <Link to="/student/ai-match">
    AI Resume Matcher 🤖
</Link>

    </div>

</div>
            <h2 className="section-title">Recommended Jobs</h2>


{jobs.length === 0 ? (
    <p>No eligible jobs found.</p>
) : (
    <div className="job-grid">

        {jobs.map((job) => (
            <div className="job-card" key={job._id}>

                <h3>{job.role}</h3>

                <p>Company: {job.company}</p>

                <p>Location: {job.location}</p>

                <p>Minimum CGPA: {job.minCGPA}</p>

                <button
                    className="apply-button"
                    onClick={() => handleApply(job._id)}
                >
                    Apply
                </button>

            </div>
        ))}

    </div>
)}
    
    <h2 className="section-title">My Applications</h2>

{applications.length === 0 ? (
    <p>You have not applied to any jobs yet.</p>
) : (
    <div className="application-grid">

        {applications.map((application) => (
            <div className="application-card" key={application._id}>

                <h3>{application.job?.role}</h3>

                <p>
                    <strong>Company:</strong>{" "}
                    {application.job?.company}
                </p>

                <p>
                    <strong>Location:</strong>{" "}
                    {application.job?.location}
                </p>

                <p>
                    <strong>Package:</strong>{" "}
                    {application.job?.package}
                </p>

                <span className={`status status-${application.status.toLowerCase()}`}>
                  {application.status}
                </span>

                <p>
                    <strong>Applied On:</strong>{" "}
                    {application.appliedAt
                        ? new Date(application.appliedAt).toLocaleDateString()
                        : "N/A"}
                </p>

            </div>
        ))}

    </div>
)}
        </div>
    );
}

export default StudentDashboard;