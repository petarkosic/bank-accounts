import { createClient } from "redis";
import { config } from 'dotenv';
config();

let _client;

export async function createRedisClient() {
    if (_client) return _client;
    try {
        const client = createClient({
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT,
        });
        client.on('error', (err) => {
            handleRedisError(err, client);
        });
        await client.connect();
        console.log('Redis client connected');
        _client = client;
    }
    catch (error) {
        console.error(error);
    }
}

export function getRedisClient() {
    if (_client == undefined) {
        throw new Error('Redis client not connected');
    }
    return _client;
}

function handleRedisError(err, client) {
    client.quit();
    console.error(err);
}