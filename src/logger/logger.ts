import logger from 'pino';
import * as dayjs from 'dayjs';

//Custom logger with TIMESTAMPS
const log = logger({
    // transport: {
    //     // target: 'pino-pretty',
    //     options: {
    //         colorize: true,
    //     },
    // },
    base: {
        pid: false,
    },
    timestamp: () => `,"time":"${dayjs().format()}"`,
});

export default log;
