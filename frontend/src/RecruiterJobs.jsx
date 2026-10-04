import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "./api";
import "./RecruiterJobs.css";

function RecruiterJobs() {
    const [jobs, setJobs] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const response = await API.get("/recruiter/jobs");

            setJobs(response.data);

        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "Failed to fetch jobs"
            );
        }
    };
    const handleDelete = async (jobId) => {
    const confirmDelete = window.confirm(
        "Are you sure you want to delete this job?"
    );

    if (!confirmDelete) {
        return;
    }

    try {
        const response = await API.delete(
            `/recruiter/jobs/${jobId}`
        );

        alert(response.data.message);

        fetchJobs();

    } catch (error) {
        alert(
            error.response?.data?.message ||
            "Failed to delete job"
        );
    }
};

    
return (
    <div className="jobs-page">

        <div className="jobs-header">

            <h1>My Jobs</h1>

            <Link
                className="back-link"
                to="/recruiter/dashboard"
            >
                ← Dashboard
            </Link>

        </div>

        {message && <p>{message}</p>}

        {jobs.length === 0 ? (

            <p>No jobs posted yet.</p>

        ) : (

            <div className="jobs-grid">

                {jobs.map((job) => (

                    <div
                        className="job-card"
                        key={job._id}
                    >

                        <h2>{job.role}</h2>

                        <p>
                            <strong>Company:</strong>{" "}
                            {job.company}
                        </p>

                        <p>
                            <strong>Location:</strong>{" "}
                            {job.location}
                        </p>

                        <p>
                            <strong>Minimum CGPA:</strong>{" "}
                            {job.minCGPA}
                        </p>

                        <p>
                            <strong>Skills:</strong>{" "}
                            {job.skills?.join(", ")}
                        </p>

                        <p>
                            <strong>Package:</strong>{" "}
                            {job.package}
                        </p>

                        <div className="job-actions">

                            <Link
                                to={`/recruiter/jobs/${job._id}/applicants`}
                            >
                                View Applicants
                            </Link>

                            <button
                                className="delete-button"
                                onClick={() =>
                                    handleDelete(job._id)
                                }
                            >
                                Delete Job
                            </button>

                        </div>

                    </div>

                ))}

            </div>

        )}

    </div>
);

    
}

export default RecruiterJobs;