const User_Type = require('./User_Type');
const User = require('./User');
const Quiz = require('./Quiz');
const Question = require('./Question');
const Answer = require('./Answer');
const Response = require('./Response');
const Log = require('./Log');

// Relacion Usuarios - Quizes
User.hasMany(Quiz)
Quiz.belongsTo(User);

// Relacion Quizes - Preguntas
Quiz.hasMany(Question);
Question.belongsTo(Quiz);

// Relaion Preguntas - Respuestas
Question.hasMany(Answer);
Answer.belongsTo(Question);

// Relacion User - Response - Quiz
Quiz.hasMany(Response);
Response.belongsTo(Quiz);
User.hasMany(Response);
Response.belongsTo(User);