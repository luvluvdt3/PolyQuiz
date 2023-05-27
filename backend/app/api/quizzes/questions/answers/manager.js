//On importe les objets dont on a besoin
const { Answer } = require("../../../../models");
const NotFoundError = require("../../../../utils/errors/not-found-error.js");
const { getQuestionFromQuiz } = require("../manager");

/**
 * Méthode qui renvoit la liste des réponses associées à la question ayant pour id questionId
 */
const filterAnswersFromQuestion = (questionId) => {
  const answers = Answer.get();
  const parsedId = parseInt(questionId, 10);
  return answers.filter((answer) => answer.questionId === questionId);
};

/**
 * Méthode qui permet de récupérer une réponse d'une question en fonction de l'id du quiz de la question, de l'id de la question et de l'id de la réponse.
 */
const getAnswerFromQuestion = (quizId, questionId, answerId) => {
  const question = getQuestionFromQuiz(quizId, questionId);
  const answer = Answer.getById(answerId);
  if (answer.questionId !== question.id)
    throw new NotFoundError(
      `${answer.name} id=${answerId} was not found for ${question.name} id=${question.id} : not found`
    );
  return answer;
};

//Exportation des méthodes
module.exports = {
  getAnswerFromQuestion,
  filterAnswersFromQuestion,
};
