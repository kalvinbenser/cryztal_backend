import 'reflect-metadata';
import { createConnection } from 'typeorm';
import app from './app';
import log from './logger/logger';
import { AppDataSource } from './data-source';
createConnection()
    .then(async () => {
        AppDataSource.initialize()
            .then(async () => {
                log.info(`Db connected successfully`);
            })
            .catch((error) => log.error(error));

        app.listen(3000, '0.0.0.0', () => log.info(`server running on port ${3000}`));
    })
    .catch((error) => log.error(error));
