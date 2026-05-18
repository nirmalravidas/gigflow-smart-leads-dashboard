import 'dotenv/config';
import createApp from './app';
import { connectDatabase } from './database/db';
import { config } from './config/env';
import mongoose from 'mongoose';

const startServer = async (): Promise<void> => {
    try {
        await connectDatabase();

        const app = createApp();
        const server = app.listen(config.server.port, () => {

        console.log(
            `Server running in ${config.server.nodeEnv} mode on port ${config.server.port}`,
        );
        });

        const shutdown = async (signal: string): Promise<void> => {
            console.log(`[server] received ${signal}, shutting down...`);
            server.close(async () => {
                try {
                    await mongoose.connection.close();
                } finally {
                    process.exit(0);
                }
            });
        };

        process.on('SIGTERM', () => void shutdown('SIGTERM'));
        process.on('SIGINT', () => void shutdown('SIGINT'));

    } catch (error) {
        console.log('Server failed:', error);
        process.exit(1);
    }
};

startServer();
