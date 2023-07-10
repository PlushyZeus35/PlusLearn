const User = require('./user');
const Test = require('./test');
const Question = require('./question');
const Answer = require('./answer');

User.hasMany(Test);
Test.belongsTo(User);

Test.hasMany(Question);
Question.belongsTo(Test);

Question.hasMany(Answer);
Answer.belongsTo(Question);