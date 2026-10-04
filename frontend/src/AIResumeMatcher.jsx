
import { useEffect, useState } from "react";
import API from "./api";

function AIResumeMatcher() {

    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState("");
    const [resume, setResume] = useState(null);

    const [result, setResult] = useState(null);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);


    useEffect(() => {

        API.get("/applications/student/eligible-jobs")
            .then((response) => {
                setJobs(response.data);
            })
            .catch((error) => {
                console.error(error);
                setMessage("Failed to load jobs");
            });

    }, []);


    const handleAnalyze = async () => {

        if (!selectedJob) {
            setMessage("Please select a job");
            return;
        }

        if (!resume) {
            setMessage("Please upload your resume");
            return;
        }

        try {

            setLoading(true);
            setMessage("");
            setResult(null);

            const formData = new FormData();

            formData.append("resume", resume);

            const response = await API.post(
                `/ai/match/${selectedJob}`,
                formData
            );

            setResult(response.data.result);

        } catch (error) {

            console.error(error);

            setMessage(
                error.response?.data?.message ||
                "Failed to analyze resume"
            );

        } finally {

            setLoading(false);

        }
    };


    return (
        <div>

            <h1>AI Resume Matcher 🤖</h1>

            <p>
                Upload your resume and compare it with a job.
            </p>

            <hr />


            <h2>Select Job</h2>

            <select
                value={selectedJob}
                onChange={(e) =>
                    setSelectedJob(e.target.value)
                }
            >

                <option value="">
                    -- Select a Job --
                </option>

                {jobs.map((job) => (

                    <option
                        key={job._id}
                        value={job._id}
                    >
                        {job.role} - {job.company}
                    </option>

                ))}

            </select>


            <h2>Upload Resume</h2>

            <input
                type="file"
                accept=".pdf"
                onChange={(e) =>
                    setResume(e.target.files[0])
                }
            />


            <br />
            <br />

            <button
                onClick={handleAnalyze}
                disabled={loading}
            >
                {loading
                    ? "Analyzing..."
                    : "Analyze Resume"}
            </button>


            {message && (
                <p>{message}</p>
            )}


            {result && (

                <div>

                    <hr />

                    <h2>
                        Match Score: {result.matchScore}%
                    </h2>


                    <h3>
                        Matching Skills
                    </h3>

                    {result.matchingSkills.length === 0 ? (

                        <p>
                            No matching skills found.
                        </p>

                    ) : (

                        <ul>
                            {result.matchingSkills.map(
                                (skill) => (
                                    <li key={skill}>
                                        {skill}
                                    </li>
                                )
                            )}
                        </ul>

                    )}


                    <h3>
                        Missing Skills
                    </h3>

                    {result.missingSkills.length === 0 ? (

                        <p>
                            No missing skills 🎉
                        </p>

                    ) : (

                        <ul>
                            {result.missingSkills.map(
                                (skill) => (
                                    <li key={skill}>
                                        {skill}
                                    </li>
                                )
                            )}
                        </ul>

                    )}


                    <h3>
                        Suggestions
                    </h3>

                    <p>
                        {result.suggestions}
                    </p>

                </div>

            )}

        </div>
    );
}

export default AIResumeMatcher;

