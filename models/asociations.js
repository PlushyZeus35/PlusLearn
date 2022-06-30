const User_Type = require('./User_Type');
const User = require('./User');
const Quiz = require('./Quiz');
const Question = require('./Question');
const Answer = require('./Answer');

// Relacion Usuarios - Quizes
// Se añade userId a la tabla quizzes
User.hasMany(Quiz)

// Se añade userId a la tabla quizzes
Quiz.belongsTo(User);

// Relacion Quizes - Preguntas
Quiz.hasMany(Question);
Question.belongsTo(Quiz);

// Relaion Preguntas - Respuestas
Question.hasMany(Answer);
Answer.belongsTo(Question);