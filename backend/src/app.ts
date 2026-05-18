import express, {Application} from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import authRoutes from './modules/auth/routes/auth.route';
import leadsRoutes from './modules/leads/routes/lead.route';
import userRoutes from './modules/users/routes/user.route';
import { globalRateLimiter } from './middlewares/rateLimiter';
import { config } from './config/env';
import { notFound } from './middlewares/notFound';
import { errorHandler } from './middlewares/errorHandler';

const createApp = (): Application => {
    const app = express();

    app.set('trust proxy', 1);

    // security header
    app.use(helmet());

    // CORS configuration
    app.use(
        cors({
            origin: config.client.url,
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization'],
        }),
    );


    // body parser with size limit
    app.use(express.json({limit: '10mb'}));
    app.use(express.urlencoded({extended: true, limit: '10mb'}));

    if (!process.env.NODE_ENV) {
        app.use(morgan('dev'));
    } else {
        app.use(morgan('combined'));
    }

    app.use(globalRateLimiter);

    const API_PREFIX = '/api/v1';
    app.get(`${API_PREFIX}/health`, (_req, res) => {
        res.status(200).json({ success: true, status: 'ok' });
    });
    app.use(`${API_PREFIX}/auth`, authRoutes);
    app.use(`${API_PREFIX}/leads`, leadsRoutes);
    app.use(`${API_PREFIX}/users`, userRoutes)

    // 404 + error handler
    app.use(notFound);
    app.use(errorHandler);

    return app;
};

export default createApp;
