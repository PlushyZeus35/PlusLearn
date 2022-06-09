const User = require('../models/User');
const Quiz = require('../models/Quiz');

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

databaseHelper.getAllQuizzes = async () => {
    return Quiz.findAll();
}

databaseHelper.getQuizById = async (id) => {
    const result = await Quiz.findByPk(id);
    console.log(result);
    return result;
}

databaseHelper.getQuizByName = async (name) => {
    return Quiz.findAll({
        where: {
            name: name
        }
    })
}

databaseHelper.setNewQuiz = async (name, description, user_id) => {
    return await Quiz.create({ 
                            name: name,
                            description: description,
                            userId: user_id
                        });
}

databaseHelper.deleteQuizById = async (id) => {
    try{
        await Quiz.destroy({
                        where: {
                            id: id
                        }
        })
        return true;
    }catch(e){
        console.log(e);
        return false;
    }
    
}

module.exports = databaseHelper;