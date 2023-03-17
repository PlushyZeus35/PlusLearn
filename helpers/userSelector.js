const userSelector = {};
const User = require('../models/user')
const { Op, where } = require("sequelize");

userSelector.createUser = async (username, password, email) => {
    return await User.create(
        { 
            username: username,
            password: password,
            email: email 
        }
    );
}

userSelector.getUser = async (username, email) => {
    return await User.findAll(
        {
            where: {
              [Op.or]: [
                { username: username },
                { email: email }
              ]
            }
          }
    )
}

userSelector.updateLastLogin = async (userId) => {
	return await User.update(
		{
			lastLogin: new Date()
		},
		{
			where: {
				id: userId
			}
		}
	)
}

module.exports = userSelector;