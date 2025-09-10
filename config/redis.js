const Redis = require('ioredis');
require('dotenv').config();

const redis = new Redis({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : 6379,
    password: process.env.REDIS_PASSWORD || undefined
});

redis.on('connect', () => console.log('Redis connected!!'));
redis.on('error', (err) => console.error('Redis error', err));

module.exports = redis;
