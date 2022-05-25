const User_Type = require('./User_Type');
const User = require('./User');
const Quiz = require('./Quiz');

// Relacion Usuarios - Quizes
// Se añade userId a la tabla quizzes
User.hasMany(Quiz)

// Se añade userId a la tabla quizzes
Quiz.belongsTo(User);