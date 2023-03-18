const User = require('./user');
const Test = require('./test');

User.hasMany(Test);
Test.belongsTo(User);