import { Link } from "react-router-dom";

function RecruiterDashboard() {
    const logout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
    };

    return (
        <div>
            <h1>Recruiter Dashboard</h1>

            <p>Welcome Recruiter!</p>

            <hr />

            <h2>Recruiter Actions</h2>

            <Link to="/recruiter/jobs/create">
                Create Job
            </Link>

            <br />
            <br />

            <Link to="/recruiter/jobs">
                My Jobs
            </Link>

            <br />
            <br />

            <button onClick={logout}>
                Logout
            </button>
        </div>
    );
}

export default RecruiterDashboard;