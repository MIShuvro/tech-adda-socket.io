require("dotenv").config();
const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");

const formatMsg = require("./helper/formatMsg");
const {
	userJoin,
	getCurrentUser,
	userLeave,
	getAllUsersPerRoom,
} = require("./helper/users");

const app = express();

const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
	// join room
	socket.on("joinRoom", ({ username, room }) => {
		const user = userJoin(socket.id, username, room);

		socket.join(user.room);

		// Welcome to current user
		socket.emit(
			"message",
			formatMsg("TECH ADDA BOT", `Welcome to Tech Adda ${user.username}`)
		);

		// When user connects
		socket.broadcast
			.to(user.room)
			.emit(
				"message",
				formatMsg(
					"TECH ADDA BOT",
					`${user.username} has joined the chat`
				)
			);

		// send users and room name
		io.to(user.room).emit("roomUsers", {
			room: user.room,
			users: getAllUsersPerRoom(user.room),
		});
	});

	// Start chat message
	socket.on("chatMessage", (msg) => {
		const user = getCurrentUser(socket.id);

		// send everybody
		io.to(user.room).emit("message", formatMsg(user.username, msg));
	});

	// when user leave
	socket.on("disconnect", () => {
		const user = userLeave(socket.id);
		if (user) {
			io.to(user.room).emit(
				"message",
				formatMsg("TECH ADDA BOT", `${user.username} has left the chat`)
			);

			// send users and room name
			io.to(user.room).emit("roomUsers", {
				room: user.room,
				users: getAllUsersPerRoom(user.room),
			});
		}
	});
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
	console.log(`Server running on port <<${PORT}>>`);
});
