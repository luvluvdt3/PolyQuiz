//Imports de la classe
const { Router } = require("express");

const { Quiz } = require("../../models");
const manageAllErrors = require("../../utils/routes/error-management");
const QuestionsRouter = require("./questions");
const { buildQuizz, buildQuizzes } = require("./manager");

//Creation du routeur
const router = new Router();

//Affecte le questionsRouter au routeur via l'URL quizId/questions (donc gestion des questions par ce questionRouteur)
router.use("/:quizId/questions", QuestionsRouter);

//Récupération (GET) de la route / (donc de tous les quiz)
router.get("/", (req, res) => {
  try {
    const quizzes = buildQuizzes(); // On appelle la méthode sans paramètre car on veut tous les récupérer
    res.status(200).json(quizzes);
  } catch (err) {
    manageAllErrors(res, err);
  }
});

// Récupération (GET) du quiz ayant pour id quiId
router.get("/:quizId", (req, res) => {
  try {
    const quizz = buildQuizz(req.params.quizId); // Cette fois ci on passe l'id du quiz que l'on souhaite récupérer en paramètre
    res.status(200).json(quizz);
  } catch (err) {
    manageAllErrors(res, err);
  }
});

// Création (POST) d'un quiz
router.post("/", (req, res) => {
  try {
    const quiz = Quiz.create({ ...req.body });
    res.status(201).json(quiz);
  } catch (err) {
    manageAllErrors(res, err);
  }
});

// Mise à jour (PUT) du quiz ayant pour id quizId
router.put("/:quizId", (req, res) => {
  try {
    res.status(200).json(Quiz.update(req.params.quizId, req.body));
  } catch (err) {
    manageAllErrors(res, err);
  }
});

//Suppression (DELETE) du quiz ayant pour id quizId
router.delete("/:quizId", (req, res) => {
  try {
    Quiz.delete(req.params.quizId);
    res.status(204).end();
  } catch (err) {
    manageAllErrors(res, err);
  }
});

//Exportation du routeur afin de pouvoir l'utiliser dans un autre code js
module.exports = router;
