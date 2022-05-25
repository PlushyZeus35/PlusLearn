const User = require('../models/User');
const databaseHelper = {};
const { Op } = require("sequelize");

// User Queries
databaseHelper.getAllUser = async () => {
    return User.findAll();
}

databaseHelper.getUserByUsername = async (username) => {
    return User.findAll({
        where: {
            username: username
        }
    })
}

databaseHelper.setNewUser = async (username, email, password, userType_id) => {
    return await User.create({ 
                            username: username, 
                            email: email, 
                            password: password, 
                            typeUserId: userType_id 
                        });
}


module.exports = databaseHelper;

