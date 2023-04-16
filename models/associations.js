const User = require('./user');
const Test = require('./test');
const Question = require('./question');

User.hasMany(Test);
Test.belongsTo(User);

Test.hasMany(Question);
Question.belongsTo(Test);