async function loadJobs() {

    const response = await fetch("/jobs");

    const jobs = await response.json();

    const jobsDiv = document.getElementById("jobs");

    jobsDiv.innerHTML = "";

    jobs.forEach(job => {

        const jobCard = document.createElement("div");

        jobCard.className = "job-card";

        jobCard.innerHTML = `
            <h2>${job.company}</h2>
            <p>Role: ${job.role}</p>
            <p>Minimum CGPA: ${job.minCGPA}</p>
            <p>Package: ${job.package} LPA</p>
            <p>Location: ${job.location}</p>
        `;

        jobsDiv.appendChild(jobCard);
    });
}


async function findEligibleJobs() {

    const token =
        localStorage.getItem("token");

    if (!token) {
        alert("Please login first");
        return;
    }

    const response = await fetch(
        "/applications/student/eligible-jobs",
        {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }
    );

    const jobs = await response.json();

    const jobsDiv =
        document.getElementById("eligibleJobs");

    jobsDiv.innerHTML = "";

    if (jobs.length === 0) {

        jobsDiv.innerHTML =
            "<p>No eligible jobs found.</p>";

        return;
    }

    jobs.forEach(job => {

        const jobCard =
            document.createElement("div");

        jobCard.className = "job-card";

       jobCard.innerHTML = `
    <h2>${job.company}</h2>
    <p>Role: ${job.role}</p>
    <p>Minimum CGPA: ${job.minCGPA}</p>
    <p>Package: ${job.package} LPA</p>
    <p>Location: ${job.location}</p>

    <button onclick="applyForJob('${studentId}', '${job._id}')">
        Apply
    </button>
`;

        jobsDiv.appendChild(jobCard);
    });
}
async function applyForJob(jobId) {

   const token =
        localStorage.getItem("token");

    if (!token) {
        alert("Please login first");
        return;
    }

    const response = await fetch(
        "/applications",
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },

            body: JSON.stringify({
                jobId: jobId
            })
        }
    );


    const result = await response.json();

    alert(result.message);
}

async function loadApplications() {

     const token =
        localStorage.getItem("token");

    if (!token) {
        alert("Please login first");
        return;
    }

    const response = await fetch(
        "/applications/student",
        {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }
    );

    const applications = await response.json();

    const applicationsDiv =
        document.getElementById("applications");

    applicationsDiv.innerHTML = "";

    if (applications.length === 0) {
        applicationsDiv.innerHTML =
            "<p>No applications found.</p>";
        return;
    }

    applications.forEach(application => {

        const card = document.createElement("div");

        card.className = "job-card";

        card.innerHTML = `
            <h2>${application.job.company}</h2>
            <p>Role: ${application.job.role}</p>
            <p>Package: ${application.job.package} LPA</p>
            <p>Location: ${application.job.location}</p>
            <strong>Status: ${application.status}</strong>
        `;

        applicationsDiv.appendChild(card);
    });
}
function toggleEligibleJobs() {

    const jobsDiv = document.getElementById("eligibleJobs");

    if (jobsDiv.innerHTML.trim() !== "") {
        jobsDiv.innerHTML = "";
        return;
    }

    findEligibleJobs();
}


function toggleJobs() {

    const jobsDiv = document.getElementById("jobs");

    if (jobsDiv.innerHTML.trim() !== "") {
        jobsDiv.innerHTML = "";
        return;
    }

    loadJobs();
}


function toggleApplications() {

    const applicationsDiv =
        document.getElementById("applications");

    if (applicationsDiv.innerHTML.trim() !== "") {
        applicationsDiv.innerHTML = "";
        return;
    }

    loadApplications();
}

async function login() {

    const email =
        document.getElementById("email").value;

    const password =
        document.getElementById("password").value;

    if (!email || !password) {
        alert("Please enter email and password");
        return;
    }

    try {

        const response = await fetch("/auth/login", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email: email,
                password: password
            })

        });

        const result = await response.json();

        if (!response.ok) {
            document.getElementById("loginMessage")
                .textContent = result.message;

            return;
        }

        localStorage.setItem(
            "token",
            result.token
        );

        document.getElementById("loginMessage")
            .textContent = "Login successful";

        alert("Login successful");

    } catch (error) {

        console.error(error);

        alert("Unable to login");
    }
}

function logout() {

    localStorage.removeItem("token");

    alert("Logged out successfully");

    location.reload();
}

function checkLogin() {

    const token =
        localStorage.getItem("token");

    if (!token) {
        return false;
    }

    return true;
}