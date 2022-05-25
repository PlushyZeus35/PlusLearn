var assert = require('assert');
const request = require('supertest');
const helpers = require('../lib/helpers');
/* require('../models/index');
const databaseHelpers = require('../lib/databaseHelper'); */
//const { database } = require('../models/keys');

//- Test the test framework :)
describe('Basic Test', function () {
  describe('#indexOf()', function () {
    it('should return -1 when the value is not present', function () {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
  });
}); 

//- Test password encryption
describe('Password Encryption Test', function(){

  it('Should encrypt the password correctly', async () => {
    var correctPasswordExample = 'testPassword';
    var incorrectPasswordExample = 'testpassword';

    var encryptedPassword = await helpers.encryptPassword(correctPasswordExample);
    assert.notEqual(encryptedPassword, correctPasswordExample);

    assert.equal(true, await helpers.matchPasswords(correctPasswordExample, encryptedPassword), 'Comparing to correct password should return true');

    assert.equal(false, await helpers.matchPasswords(incorrectPasswordExample, encryptedPassword), 'Comparing to incorrect password should return false');
    
  });
});
/* 
//- Test database helper
describe('Database Helper Test', function(){

  const newUserTeacher = {
    username: 'usernameTest',
    email: 'userName@hostName.com',
    password: 'passwordTest',
    userType_id: 1
  };

  const newUserStudent = {
    username: 'usernameTest2',
    email: 'userName2@hostName.com',
    password: 'passwordTest',
    userType_id: 2
  }

  it('Should set a new User', async () => {
    
    const teacherUser = await databaseHelpers.setNewUser(newUserTeacher.username, newUserTeacher.email, newUserTeacher.password, newUserTeacher.userType_id);
    const studentUser = await databaseHelpers.setNewUser(newUserStudent.username, newUserStudent.email, newUserStudent.password, newUserStudent.userType_id);
    assert.equal('usernameTest', teacherUser.username, 'New Teacher Created');
    assert.equal('usernameTest2', studentUser.username, 'New Student Created');

  });

  it('Should get the new Users', async () => {
    const newTestUsers = await databaseHelpers.getAllUser();
    assert.notEqual(0, newTestUsers.length, 'Some Users should be retrieved');

    const teacherUser = await databaseHelpers.getUserByUsername(newUserTeacher.username);
    assert.equal(1, teacherUser.length, 'One user should be retrieved');
    assert.equal(newUserTeacher.email, teacherUser[0].email, 'Should have retrieved correct user');

    const studentUser = await databaseHelpers.getUserByUsername(newUserStudent.username);
    assert.equal(1, studentUser.length, 'One user should be retrieved');
    assert.equal(newUserStudent.email, studentUser[0].email, 'Should have retrieved correct user');
  });

}); */