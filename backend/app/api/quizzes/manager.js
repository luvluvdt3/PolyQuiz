// On importe les objets dont on a besoin
const { Quiz } = require("../../models");
const { filterQuestionsFromQuizz } = require("./questions/manager");
const { filterAnswersFromQuestion } = require("./questions/answers/manager");

/**
 * Méthode qui va permettre de créer un quiz en fonction de son id, en se servant des données de la base de données.
 * @param quizId
 */
const buildQuizz = (quizId) => {
  const quiz = Quiz.getById(quizId);
  const questions = filterQuestionsFromQuizz(quiz.id);
  const questionWithAnswers = questions.map((question) => {
    const answers = filterAnswersFromQuestion(question.id);
    return Object.assign({}, question, { answers });
  });
  //Création d'un nouvel objet contenant les propriétés du quiz et les propriétés des questions avec les réponses.
  return Object.assign({}, quiz, { questions: questionWithAnswers });
};

/**
 * Méthode qui va permettre de créer tous les quiz
 */
const buildQuizzes = () => {
  const quizzes = Quiz.get();
  const quizzesWithData = quizzes.map((quiz) => buildQuizz(quiz.id));
  return quizzesWithData;
};

//Exportation des méthodes buildQuizz et buildQuizzes.
module.exports = {
  buildQuizz: buildQuizz,
  buildQuizzes: buildQuizzes,
};
