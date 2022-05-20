var assert = require('assert');
const request = require('supertest');
const app = require('../app');

//- Test the test framework :)
describe('Basic Test', function () {
  describe('#indexOf()', function () {
    it('should return -1 when the value is not present', function () {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
  });
}); 

//- Test the availability of routes
describe('App Endpoints', function() {

  it('should return the index page', function(done) {
    request(app)
      .get('/')
      .expect(200, done);
  });

  it('Should return the hello world page', function() {
    request(app)
      .get('/test')
      .expect(200)
      .then(res => {
        assert.ok(res.body == 'Hello World!');
      });
  });

  it('Should return the pug sample page', function() {
    request(app)
      .get('/pug')
      .expect(200)
      .then(res => {
        assert.ok(res.header.title == 'Hey');
      });
  });
  
}); 