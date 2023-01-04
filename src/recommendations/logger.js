const {createLogger, format, transports} = require('winston')
const {combine, timestamp, prettyPrint, splat, printf} = format;

const myFormat = printf(info => {
    // This will customize the Error Message
    if(info instanceof Error) {
        return `${info.timestamp} ${info.level}: ${info.message} ${info.stack}`;
    }
    return `${info.timestamp}  ${info.level}: ${info.message}`;
});

const logger = createLogger({
    level: 'info',
    handleExceptions: true,
    format: combine(timestamp(), prettyPrint(), splat(), myFormat),
    transports: [new transports.Console()],
    exitOnError: false,
})

module.exports = {logger}
