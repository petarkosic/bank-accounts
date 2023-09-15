import { createClient } from "redis";
import { config } from 'dotenv';

class RedisClient {
    constructor() {
        config();
        this._client = null;
    }

    async createRedisClient() {
        if (this._client) {
            return this._client;
        }

        try {
            const client = createClient({
                host: process.env.REDIS_HOST,
                port: process.env.REDIS_PORT,
            });
            client.on('error', (err) => {
                this.handleRedisError(err, client);
            });
            await client.connect();
            console.log('Redis client connected');
            this._client = client;
        } catch (error) {
            console.error(error);
        }
    }

    getRedisClient() {
        if (this._client == null) {
            throw new Error('Redis client not connected');
        }
        return this._client;
    }

    handleRedisError(err, client) {
        client.quit();
        console.error(err);
    }
}

export default new RedisClient();
