import { useEffect, useState } from "react";
import API from "./api";

function StudentProfile() {

    const [student, setStudent] = useState(null);

    const [name, setName] = useState("");
    const [cgpa, setCgpa] = useState("");
    const [skills, setSkills] = useState("");

    const [message, setMessage] = useState("");

    // Get profile
    useEffect(() => {

        API.get("/users/profile")
            .then((response) => {

                const data = response.data;

                setStudent(data);

                setName(data.name || "");
                setCgpa(data.cgpa || "");
                setSkills(data.skills?.join(", ") || "");
            })
            .catch((error) => {
                console.error("PROFILE ERROR:", error);
            });

    }, []);


    // Update profile
    const updateProfile = async (e) => {

        e.preventDefault();

        try {

            const response = await API.patch("/users/profile", {

                name: name,

                cgpa: Number(cgpa),

                skills: skills
                    .split(",")
                    .map((skill) => skill.trim())
                    .filter((skill) => skill !== "")
            });

            setMessage(response.data.message);

            // Update displayed data
            setStudent({
                ...student,
                name: name,
                cgpa: Number(cgpa),
                skills: skills
                    .split(",")
                    .map((skill) => skill.trim())
                    .filter((skill) => skill !== "")
            });

        } catch (error) {

            setMessage(
                error.response?.data?.message ||
                "Failed to update profile"
            );
        }
    };


    if (!student) {
        return <p>Loading profile...</p>;
    }


    return (

        <div>

            <h1>Student Profile</h1>

            <form onSubmit={updateProfile}>

                <div>
                    <label>Name:</label>

                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <br />

                <div>
                    <label>Email:</label>

                    <input
                        type="email"
                        value={student.email}
                        disabled
                    />
                </div>

                <br />

                <div>
                    <label>CGPA:</label>

                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="10"
                        value={cgpa}
                        onChange={(e) => setCgpa(e.target.value)}
                    />
                </div>

                <br />

                <div>
                    <label>Skills:</label>

                    <input
                        type="text"
                        value={skills}
                        onChange={(e) => setSkills(e.target.value)}
                        placeholder="React, Node.js, MongoDB"
                    />
                </div>

                <br />

                <button type="submit">
                    Update Profile
                </button>

            </form>

            <p>{message}</p>

        </div>
    );
}

export default StudentProfile;