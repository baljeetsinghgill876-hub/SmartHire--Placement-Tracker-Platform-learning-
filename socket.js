const { Server } = require("socket.io");

let io;

function initializeSocket(server) {

    io = new Server(server, {
        cors: {
            origin: "http://localhost:5173"
        }
    });

    io.on("connection", (socket) => {

    console.log("User connected:", socket.id);

    socket.on("student-online", (studentId) => {

        console.log("Student online:", studentId);

        const room = `student:${studentId.toString()}`;

        socket.join(room);

        console.log("Student joined room:", room);
        console.log("Socket rooms:", [...socket.rooms]);
    });

});

    return io;
}

function getIO() {
    if (!io) {
        throw new Error("Socket.IO has not been initialized");
    }

    return io;
}

module.exports = {
    initializeSocket,
    getIO
};