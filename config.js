module.exports = {
    maintenance: process.env.PLUSLEARN_MAINTENANCE,
    database: {
        password: process.env.PLUSLEARNDB_PASSWORD,
        database: process.env.PLUSLEARNDB_DATABASE,
        host: process.env.PLUSLEARNDB_HOST,
        user: process.env.PLUSLEARNDB_USER,
        port: process.env.DATABASE_PORT
    },
    email: {
        password: process.env.EMAIL_PASSWORD,
        receiver: process.env.EMAIL_RECEIVER,
        sender: process.env.EMAIL_SENDER
    }
}