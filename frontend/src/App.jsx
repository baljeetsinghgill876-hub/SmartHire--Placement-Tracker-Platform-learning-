import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./Login";
import StudentDashboard from "./StudentDashboard";
import StudentProfile from "./studentProfile";
import RecruiterDashboard from "./RecruiterDashboard";
import CreateJob from "./CreateJob";
import RecruiterJobs from "./RecruiterJobs";
import Applicants from "./Applicants";
import AIResumeMatcher from "./AIResumeMatcher";
function App() {
    return (
        <BrowserRouter>

            <Routes>

                <Route path="/login" element={<Login />} />

                <Route
                    path="/student/dashboard"
                    element={<StudentDashboard />}
                />
                <Route
                    path="/student/profile"
                    element={<StudentProfile />}
                />
                <Route
                    path="/recruiter/dashboard"
                    element={<RecruiterDashboard />}
                />
                <Route
                   path="/recruiter/jobs/create"
                   element={<CreateJob />}
                />
                <Route
                    path="/recruiter/jobs"
                    element={<RecruiterJobs/>}

                 />   
                 <Route
                    path="/recruiter/jobs/:jobId/applicants"
                    element={<Applicants />}
                 />

                 <Route
                   path="/student/ai-match"
                  element={<AIResumeMatcher />}
                />
            </Routes>

        </BrowserRouter>
    );
}

export default App;