import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "./api";

function CreateJob() {

    const [company, setCompany] = useState("");
    const [role, setRole] = useState("");
    const [location, setLocation] = useState("");
    const [minCGPA, setMinCGPA] = useState("");
    const [skills, setSkills] = useState("");
    const [packageValue, setPackageValue] = useState("");

    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const response = await API.post("/recruiter/jobs", {

                company: company,

                role: role,

                location: location,

                minCGPA: Number(minCGPA),

                skills: skills
                    .split(",")
                    .map((skill) => skill.trim())
                    .filter((skill) => skill !== ""),

                package: packageValue

            });

            setMessage(response.data.message || "Job created successfully");

            // Clear form
            setCompany("");
            setRole("");
            setLocation("");
            setMinCGPA("");
            setSkills("");
            setPackageValue("");

        } catch (error) {

            console.error("CREATE JOB ERROR:", error);

            setMessage(
                error.response?.data?.message ||
                "Failed to create job"
            );
        }
    };


    return (
        <div>

            <h1>Create Job</h1>

            <form onSubmit={handleSubmit}>

                <div>
                    <label>Company:</label>
                    <input
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        required
                    />
                </div>

                <br />

                <div>
                    <label>Role:</label>
                    <input
                        type="text"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        required
                    />
                </div>

                <br />

                <div>
                    <label>Location:</label>
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                    />
                </div>

                <br />

                <div>
                    <label>Minimum CGPA:</label>
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="10"
                        value={minCGPA}
                        onChange={(e) => setMinCGPA(e.target.value)}
                        required
                    />
                </div>

                <br />

                <div>
                    <label>Skills:</label>
                    <input
                        type="text"
                        placeholder="React, Node.js, MongoDB"
                        value={skills}
                        onChange={(e) => setSkills(e.target.value)}
                        required
                    />
                </div>

                <br />

                <div>
                    <label>Package:</label>
                    <input
                        type="text"
                        placeholder="10 LPA"
                        value={packageValue}
                        onChange={(e) => setPackageValue(e.target.value)}
                    />
                </div>

                <br />

                <button type="submit">
                    Create Job
                </button>

            </form>

            <p>{message}</p>

        </div>
    );
}

export default CreateJob;