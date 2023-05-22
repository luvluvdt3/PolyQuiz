//imports
const { Quiz, Question } = require("../../../models");
const NotFoundError = require("../../../utils/errors/not-found-error.js");

/**
 *
 * Méthode qui va permettre de filtrer les questions d'un quiz en fonction de l'id du quiz.
 *
 */
const filterQuestionsFromQuizz = (quizId) => {
  const questions = Question.get();
  const parsedId = parseInt(quizId, 10);
  return questions.filter((question) => question.quizId === parsedId);
};

/**
 * Méthode qui permet de récupérer une question d'un quiz en fonction de l'id du quiz et de l'id de la question.
 */

const getQuestionFromQuiz = (quizId, questionId) => {
  const quiz = Quiz.getById(quizId);
  const quizIdInt = parseInt(quizId, 10);
  const question = Question.getById(questionId);
  if (question.quizId !== quizIdInt)
    throw new NotFoundError(
      `${question.name} id=${questionId} was not found for ${quiz.name} id=${quiz.id} : not found`
    );
  return question;
};

//Exportation des méthodes définies dans la classe
module.exports = {
  filterQuestionsFromQuizz,
  getQuestionFromQuiz,
};
