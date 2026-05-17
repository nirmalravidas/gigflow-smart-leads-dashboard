import express, {Application} from 'express';
import morgan from 'morgan';
import helmet from 'helmet';

const createApp = (): Application => {
    const app = express();
    app.use(helmet());

    app.use(express.json({limit: '10mb'}));
    app.use(express.urlencoded({extended: true, limit: '10mb'}));

    if (!process.env.NODE_ENV) {
        app.use(morgan('dev'));
    } else {
        app.use(morgan('combined'));
    }

    return app;
};

export default createApp;