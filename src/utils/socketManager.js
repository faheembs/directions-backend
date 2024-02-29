const { UserModel } = require("../model");

let onlineUsers = {};
let io;
let socketIds = ''
const initSocketManager = (socketIo) => {
    io = socketIo;

    io.on('connection', (socket) => {
        console.log('A user connected');
        socketIds = socket.id;
        socket.on('connect', () => {
            const userId = getUserIdBySocket(socket);
            if (userId) {
                console.log(`User ${userId} reconnected`);
                onlineUsers[userId] = socket.id;
                console.log('onlineUsers:', onlineUsers);
            }
        });

        // Emitting a message to the client
        socket.emit('message', 'Hello from server!');

        // Listening for client messages
        socket.on('clientMessage', (data) => {
            console.log('Message from client:', data);
        });

        // Notify SocketManager about user logout
        socket.on('login', async (userId) => {
            userLoggedIn(userId, socketIds);
            console.log(userId + ' logged in');
            console.log('login socket id ', socket.id);
            console.log('onlineUsers:', onlineUsers);
            try {
                const user = await UserModel.findById(userId);
                if (user) {
                    const updatedUser = { ...user.toObject(), online: true };
                    await UserModel.findByIdAndUpdate(userId, updatedUser);
                    console.log(`User ${userId} online status updated`);
                    io.emit('userOnlineStatus', { userId: userId, online: true });
                } else {
                    console.log(`User ${userId} not found`);
                }
            } catch (error) {
                console.error(`Error updating user ${userId} online status:`, error);
            }
        });

        socket.on('disconnectRequest', async () => {
            const userId = getUserIdBySocketId(socketIds);

            console.log('User disconnected:', userId);
            try {
                const user = await UserModel.findById(userId);
                if (user) {
                    const updatedUser = { ...user.toObject(), online: false };
                    await UserModel.findByIdAndUpdate(userId, updatedUser);
                    userLoggedOut(userId);
                    console.log(`User ${userId} online status updated to offline`);
                    io.emit('userOnlineStatus', { userId: userId, online: false });
                } else {
                    console.log(`User ${userId} not found`);
                }
            } catch (error) {
                console.error(`Error updating user ${userId} online status:`, error);
            }
        });

    });
};

const userLoggedIn = (userId, socketId) => {
    onlineUsers[userId] = socketId;

    notifyOnlineUsersChanged();
};

const userLoggedOut = (userId) => {
    delete onlineUsers[userId];
    notifyOnlineUsersChanged();
};

const notifyOnlineUsersChanged = () => {
    io.emit("onlineUsers", Object.keys(onlineUsers));
};

const getUserIdBySocketId = (socketId) => {
    console.log("Searching for socketId:", socketId);
    for (const [userId, id] of Object.entries(onlineUsers)) {
        console.log("Checking userId:", userId, "with socketId:", id);
        if (id === socketId) {
            console.log("Found userId:", userId);
            return userId;
        }
    }
    console.log("SocketId not found in onlineUsers:", socketId);
    return null;
};

module.exports = {
    initSocketManager,
    userLoggedIn,
    userLoggedOut,
};
