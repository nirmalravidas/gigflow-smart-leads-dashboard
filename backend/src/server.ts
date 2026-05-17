import 'dotenv/config';
import createApp from './app';
import { connectDatabase } from './database/db';

const startServer = async (): Promise<void> => {

    await connectDatabase();

    try {
        const app = createApp();
        app.listen(process.env.PORT, () => {

        console.log(
            `Server running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`,
        );
        });

    } catch (error) {
        console.log('Server failed:', error);
        process.exit(1);
    }
};

void startServer();