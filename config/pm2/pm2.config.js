/* eslint-disable no-undef */
module.exports = {
    name: 'Cryztal-dev',
    script: 'yarn dev',
    watch: true,
    ignore_watch: ['node_modules'],
    // new feature; increase restart delay each time after every crash or non reachable db per example
    // exp_backoff_restart_delay: 10,
    // combine_logs: true,
    // merge_logs: true,
    // error_file: 'logs/err.log', // better be /var/log
    // out_file: 'logs/out.log',
    time: true,
};
