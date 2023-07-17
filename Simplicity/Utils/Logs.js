const color = {
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    white: "\x1b[37m",
    reset: "\x1b[0m"
}

function timestamp() {
    const date = new Date();

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();

    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

const log = {
    info: (message = '') => {
        console.log(`${color.cyan}[${timestamp()}]${color.reset} ${message}`);
    },
    warn: (message = '') => {
        console.warn(`${color.yellow}[${timestamp()}]${color.reset} ${message}`);
    },
    error: (message = '') => {
        console.error(`${color.red}[${timestamp()}] ${message}${color.reset}`);
    },
    debug: (message = '') => {
        console.debug(`${color.green}[${timestamp()}]${color.reset} ${message}`);
    }
}

module.exports = log;