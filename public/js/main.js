

const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");

// get username and room name
const { username, room } = Qs.parse(location.search, {
	ignoreQueryPrefix: true,
});


const socket = io();

// join chatroom
socket.emit("joinRoom", { username, room });

// get room and users
socket.on("roomUsers", ({ room, users }) => {
	getRoomName(room);
	getAllUsers(users);
});

socket.on("message", (message) => {
	// text recevied from server
	
	getMsgFromServer(message);

	// scroll down
	chatMessages.scrollTop = chatMessages.scrollHeight;
});

// get text from input box
chatForm.addEventListener("submit", (e) => {
	e.preventDefault();
	const text = e.target.elements.msg.value;

	// text send to server
	socket.emit("chatMessage", text);

	// clear input box

	e.target.elements.msg.value = "";
	e.target.elements.msg.focus();
});

// Show message
function getMsgFromServer(message) {
	const div = document.createElement("div");
	div.classList.add("message");
	div.innerHTML = ` <p class="meta">${message.username}  <span>${message.time}</span></p>
                    <p class="text">
                       ${message.text}
                    </p>`;
	document.querySelector(".chat-messages").appendChild(div);
}

// add room name and number of user

function getRoomName(room) {
	roomName.innerText = room;
}

function getAllUsers(users) {
	userList.innerHTML = `
        ${users.map((user) => `<li>${user.username}</li>`).join('')}
    `;
}
