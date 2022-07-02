module.exports = {
    database: {
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_DATABASE_DEV,
        host: process.env.DATABASE_HOST,  //pluslearn.ddns.net o 192.168.0.200 si estoy en local
        user: process.env.CLEARDB_DATABASE_USERNAME,
        port: 3306
    }
}