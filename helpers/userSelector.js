const userSelector = {};
const PasswordReset = require('../models/passwordreset');
const User = require('../models/user')
const { Op } = require("sequelize");
const emailController = require('./emailController');

userSelector.createUser = async (username, password, email) => {
	let newUsers = [];
	try{
		newUsers = await User.create(
			{ 
				username: username,
				password: password,
				email: email 
			}
		);
	}catch(error){
		emailController.sendErrorEmail(error);
	}
	return newUsers;
}

userSelector.getUser = async (username, email) => {
	let users = [];
	try{
		users = await User.findAll(
			{
				where: {
				  [Op.or]: [
					{ username: username },
					{ email: email }
				  ]
				}
			  }
		)
	}catch(error){
		emailController.sendErrorEmail(error);
	}
	return users;
}

userSelector.getUserById = async (userId) => {
	let users;
	try{
		users = await User.findByPk(userId);
	}catch(error){
		emailController.sendErrorEmail(error);
	}
	return users;
}

userSelector.getUsers = async (usersIds) => {
	let users = [];
	try{
		users = await User.findAll({
			where: {
			id: usersIds
			}
		})
	}catch(error){
		emailController.sendErrorEmail(error);
	}
	return users;
}

userSelector.updateLastLogin = async (userId) => {
	let users = [];
	try{
		users = await User.update(
			{
				lastLogin: new Date()
			},
			{
				where: {
					id: userId
				}
			}
		)
	}catch(error){
		emailController.sendErrorEmail(error);
	}
	return users;
}

userSelector.checkPasswordResetCode = async (code) => {
	let passwordResets = [];
	try{
		passwordResets = await PasswordReset.findAll(
			{where:{code: code, active: true}}
		  )
	}catch(error){
		emailController.sendErrorEmail(error);
	}
	return passwordResets;
}

userSelector.getUserPasswordReset = async (userId) => {
	let passwordResets = [];
	try{
		passwordResets = await PasswordReset.findAll(
			{where:{userId: userId, active: true}}
		)
	}catch(error){
		emailController.sendErrorEmail(error);
	}
	return passwordResets;
}

userSelector.setUserPasswordReset = async (code, userId) => {
	let passwordResets = [];
	try{
		passwordResets = await PasswordReset.create({
			code: code,
			userId: userId,
			active: true
		})
	}catch(error){
		emailController.sendErrorEmail(error);
	}
	return passwordResets;
}

userSelector.updateUserPassword = async (userId, password) => {
	let users = [];
	try{
		users = await User.update({
			password: password
		},{
			where: {
				id: userId
			}
		})
	}catch(error){
		emailController.sendErrorEmail(error);
	}
	return users;
}

userSelector.deactivatePasswordReset = async (userId) => {
	let passwordResets = [];
	try{
		passwordResets = await PasswordReset.update({
			active: false
		},{
			where: {
				userId: userId
			}
		})
	}catch(error){
		emailController.sendErrorEmail(error);
	}
	return passwordResets;
}

module.exports = userSelector;