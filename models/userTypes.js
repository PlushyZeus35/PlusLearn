module.exports = (sequelize, type) => {
    return sequelize.define('user_types', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: type.STRING
    })
}