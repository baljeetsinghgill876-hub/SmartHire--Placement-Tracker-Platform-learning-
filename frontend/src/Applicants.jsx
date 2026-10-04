import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import API from "./api";
import "./Applicants.css";

function Applicants() {
    const { jobId } = useParams();

    const [applicants, setApplicants] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchApplicants();
    }, []);

    const fetchApplicants = async () => {
        try {
            const response = await API.get(
                `/recruiter/jobs/${jobId}/applicants`
            );

            setApplicants(response.data);
        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "Failed to fetch applicants"
            );
        }
    };
    const handleStatusChange = async (applicationId, newStatus) => {
    try {
        const response = await API.put(
            `/applications/${applicationId}/status`,
            {
                status: newStatus
            }
        );

        alert(response.data.message);

        fetchApplicants();

    } catch (error) {
        alert(
            error.response?.data?.message ||
            "Failed to update status"
        );
    }
};

    return (
        <div className="applicants-page">

    <div className="applicants-header">

        <h1>Applicants</h1>

        <Link to="/recruiter/jobs">
            ← Back to My Jobs
        </Link>

    </div>

            {message && <p>{message}</p>}

            {applicants.length === 0 ? (
                <p>No students have applied for this job yet.</p>
            ) : (
               <div className="applicant-grid">

    {applicants.map((application) => (
        <div className="applicant-card" key={application._id}>
                        <h2>{application.student.name}</h2>

                        <p>
                            <strong>Email:</strong>{" "}
                            {application.student.email}
                        </p>

                        <p>
                            <strong>CGPA:</strong>{" "}
                            {application.student.cgpa}
                        </p>

                        <p>
                            <strong>Skills:</strong>{" "}
                            {application.student.skills?.join(", ")}
                        </p>

                        <label>
    <strong>Status:</strong>{" "}

    <select
        className="status-select"
        value={application.status}
        onChange={(e) =>
            handleStatusChange(
                application._id,
                e.target.value
            )
        }
    >
        <option value="Applied">Applied</option>
        <option value="Shortlisted">Shortlisted</option>
        <option value="Interview">Interview</option>
        <option value="Selected">Selected</option>
        <option value="Rejected">Rejected</option>
    </select>
</label>

                        <p>
                            <strong>Applied At:</strong>{" "}
                            {new Date(
                                application.appliedAt
                            ).toLocaleString()}
                        </p>

                        <hr />
                    </div>
                ))}
                </div>
            )}
        </div>
    );
}

export default Applicants;