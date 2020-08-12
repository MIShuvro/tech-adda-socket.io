// do not use database, push all data to runtime array
const users = [];

// join user to chat
const userJoin = (id, username, room) => {
	const user = {
		id,
		username,
		room,
	};

	users.push(user);
	return user;
};

const getCurrentUser = (id) => {
	return users.find((user) => user.id === id);
};

// user leaves chat

const userLeave = (id) => {
	const userIndex = users.findIndex((user) => user.id === id);
	if (userIndex !== -1) {
		return users.splice(userIndex, 1)[0];
	}
};

// Get All User Per Room
const getAllUsersPerRoom = (room) => {
	return users.filter((user) => user.room === room);
};

module.exports = { userJoin, getCurrentUser, userLeave, getAllUsersPerRoom };
