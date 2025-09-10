require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');

require('./config/mongo');    
require('./config/redis');    
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const initSockets = require('./sockets/leaderboardSocket');

// optional job: uncomment if you added it
// require('./jobs/dailyMergeJob');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/leaderboard', leaderboardRoutes);

const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, { cors: { origin: '*' } });

initSockets(io);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
