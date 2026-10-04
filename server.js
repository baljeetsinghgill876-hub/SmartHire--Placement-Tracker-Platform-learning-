const authRoutes = require("./routes/authRoutes");
const http = require("http");
const { initializeSocket } = require("./socket");
require("dotenv").config();
const express = require("express");
const connectDB = require("./db");
const studentRoutes = require("./routes/studentRoutes");
const jobRoutes = require("./routes/jobRoutes");
 const applicationRoutes =
    require("./routes/applicationRoutes");
const errorHandler = require("./middleware/errorHandler");    
const recruiterRoutes = require("./routes/recruiterRoutes");
const userRoutes = require("./routes/user.routes");
const app = express();
const cors = require("cors");
const aiRoutes = require("./routes/aiRoutes");

const {connectRedis} = require("./redis");

app.use(express.json());
app.use(express.static("public"));
app.use(cors({
    origin: "http://localhost:5173"
}));

async function startServer() {

    const db = await connectDB();

    await connectRedis();

    app.use("/auth", authRoutes(db));

    app.use("/students", studentRoutes(db));

    app.use("/jobs", jobRoutes(db));

    app.use("/users", userRoutes);

   app.use("/applications", applicationRoutes(db));

   app.use("/recruiter" , recruiterRoutes(db));

   app.use("/ai", aiRoutes(db));

    app.get("/", (req, res) => {
        res.send("Placement Tracker API is running!");
    });

    app.use(errorHandler);

   const PORT = process.env.PORT || 3000;

   const server = http.createServer(app);
  
   initializeSocket(server);

server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});
}

startServer();