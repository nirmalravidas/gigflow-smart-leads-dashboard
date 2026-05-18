import express, {Application} from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import authRoutes from './modules/auth/routes/auth.route';
import leadsRoutes from './modules/leads/routes/lead.route'

const createApp = (): Application => {
    const app = express();

    // security header
    app.use(helmet());



    app.use(express.json({limit: '10mb'}));
    app.use(express.urlencoded({extended: true, limit: '10mb'}));

    if (!process.env.NODE_ENV) {
        app.use(morgan('dev'));
    } else {
        app.use(morgan('combined'));
    }

    const API_PREFIX = '/api/v1';
    app.use(`${API_PREFIX}/auth`, authRoutes);
    app.use(`${API_PREFIX}/leads`, leadsRoutes);

    return app;
};

export default createApp;
