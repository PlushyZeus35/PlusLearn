const userSelector = {};
const PasswordReset = require('../models/passwordreset');
const User = require('../models/user')
const { Op } = require("sequelize");

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

userSelector.getUserById = async (userId) => {
	return await User.findByPk(userId);
}

userSelector.getUsers = async (usersIds) => {
  return await User.findAll({
    where: {
      id: usersIds
    }
  })
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

userSelector.checkPasswordResetCode = async (code) => {
  return await PasswordReset.findAll(
    {where:{code: code, active: true}}
  )
}

userSelector.getUserPasswordReset = async (userId) => {
  return await PasswordReset.findAll(
    {where:{userId: userId, active: true}}
  )
}

userSelector.setUserPasswordReset = async (code, userId) => {
  return await PasswordReset.create({
    code: code,
    userId: userId,
    active: true
  })
}

userSelector.updateUserPassword = async (userId, password) => {
  return await User.update({
    password: password
  },{
    where: {
      id: userId
    }
  })
}

userSelector.deactivatePasswordReset = async (userId) => {
  return await PasswordReset.update({
    active: false
  },{
    where: {
      userId: userId
    }
  })
}

module.exports = userSelector;