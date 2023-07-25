const User = require('./user');
const Test = require('./test');
const Question = require('./question');
const Answer = require('./answer');
const TestResponse = require('./testresponse');
const Response = require('./response');

User.hasMany(Test);
Test.belongsTo(User);

Test.hasMany(Question);
Question.belongsTo(Test);

Question.hasMany(Answer);
Answer.belongsTo(Question);

User.hasMany(TestResponse);
TestResponse.belongsTo(User, {
    foreignKey: {
      allowNull: false
    }
  });
Test.hasMany(TestResponse);
TestResponse.belongsTo(Test, {
    foreignKey: {
      allowNull: false
    }
  });
Answer.hasMany(Response);
Response.belongsTo(Answer, {
    foreignKey: {
      allowNull: false
    }
  });
Question.hasMany(Response);
Response.belongsTo(Question, {
    foreignKey: {
      allowNull: false
    }
});

TestResponse.hasMany(Response);
Response.belongsTo(TestResponse, {
    foreignKey: {
      allowNull: false
    }
});
