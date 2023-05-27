//Imports nécéssaires à la gestion de notre index pour les réponses
const { Router } = require("express");
const { Answer } = require("../../../../models");

const { getQuestionFromQuiz } = require("../manager");
const {
  filterAnswersFromQuestion,
  getAnswerFromQuestion,
} = require("./manager");

//Creation du routeur avec le paramètre mergeParams à true. Cela siginifie que les paramètres de la requête seront conservés.
const router = new Router({ mergeParams: true });

//Récupération (GET) de la route / (donc de toutes les réponses)
router.get("/", (req, res) => {
  //Récupération question
  try {
    const quest = getQuestionFromQuiz(req.params.quizId, req.params.questionId);
    //Puis des réponses associées
    const answers = filterAnswersFromQuestion(quest.id);
    res.status(200).json(answers);
  } catch (err) {
    manageAllErrors(res, err);
  }
});
//Récupération (GET) de la réponse ayant pour id answerId.
router.get("/:answerId", (req, res) => {
  try {
    const answer = getAnswerFromQuestion(
      req.params.quizId,
      req.params.questionId,
      req.params.answerId
    );
    res.status(200).json(answer);
  } catch (err) {
    manageAllErrors(res, err);
  }
});

// Création (POST) d'une réponse
router.post("/", (req, res) => {
  try {
    //Récupération question
    const question = getQuestionFromQuiz(
      req.params.quizId,
      req.params.questionId
    );
    Answer.create(Object.assign({}, answer, { questionId: question.id }));
    res.status(201).json(answer);
  } catch (err) {
    manageAllErrors(res, err);
  }
});

// Mise à jour (PUT) de la réponse ayant pour id answerId
router.put("/:answerId", (req, res) => {
  try {
    //Récupération de la réponse depuis la question associée
    const answer = getAnswerFromQuestion(
      req.params.quizId,
      req.params.questionId,
      req.params.answerId
    );
    //Puis on va appliquer les modifications
    const updatedAnswer = Answer.update(
      req.params.answerId,
      Object.assign({}, req.body, { questionId: answer.questionId })
    );
    //et en informer la partie json
    res.status(200).json(updatedAnswer);
  } catch (err) {
    manageAllErrors(res, err);
  }
});

//Suppression (DELETE) de la réponse ayant pour id answerId
router.delete("/:answerId", (req, res) => {
  try {
    getAnswerFromQuestion(
      req.params.quizId,
      req.params.questionId,
      req.params.answerId
    );
    Answer.delete(req.params.answerId);
    res.status(204).end();
  } catch (err) {
    manageAllErrors(res, err);
  }
});

//Exportation du routeur
module.exports = router;
