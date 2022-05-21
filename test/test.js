var assert = require('assert');
const request = require('supertest');
const helpers = require('../lib/helpers');

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