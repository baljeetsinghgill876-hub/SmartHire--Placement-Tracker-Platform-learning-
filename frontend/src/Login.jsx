import { useState } from "react";
import API from "./api";
import { useNavigate } from "react-router-dom";

function Login() {

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

   const handleLogin = async (e) => {
    e.preventDefault();

    try {
        const response = await API.post("/auth/login", {
            email,
            password
        });

        localStorage.setItem("token", response.data.token);

        const token = response.data.token;

        const payload = JSON.parse(
            atob(token.split(".")[1])
        );

        if (payload.role === "student") {
            navigate("/student/dashboard");
        } 
        else if (payload.role === "recruiter") {
            navigate("/recruiter/dashboard");
        } 
        else {
            setMessage("Invalid user role");
        }

    } catch (error) {
        setMessage(
            error.response?.data?.message || "Login failed"
        );
    }
};
    

    return (
        <div>
            <h1>Login</h1>

            <form onSubmit={handleLogin}>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <br /><br />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <br /><br />

                <button type="submit">
                    Login
                </button>

            </form>

            <p>{message}</p>
        </div>
    );
}

export default Login;