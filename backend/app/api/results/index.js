//Imports de la classe

const { Router } = require("express");
const { Result } = require("../../models");
const manageAllErrors = require("../../utils/routes/error-management");
const { buildResults } = require("./manager");

//Creation du routeur
const router = new Router();

//Récupération (GET) de la route / (donc de tous les résultats)
router.get("/", (req, res) => {
  try {
    const results = buildResults();
    res.status(200).json(results);
  } catch (err) {
    manageAllErrors(res, err);
  }
});

//Récupération (GET) de la route du résultat avec l'id resultId
router.get("/:resultId", (req, res) => {
  try {
    res.status(200).json(Result.getById(req.params.resultId));
  } catch (err) {
    res.status(500).json(err);
  }
});

//Récupération (GET) de la route du quiz ayant pour id quizId depuis le résultat
router.get("/quiz/:quizId", (req, res) => {
  try {
    res.status(200).json(Result.getByQuizId(req.params.quizId));
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

//Récupération (GET) de la route des utilisateurs ayant pour id userId depuis le résultat
router.get("/user/:userId", (req, res) => {
  try {
    res.status(200).json(Result.getByUserId(req.params.userId));
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

//Création (POST) d'un résultat de manière asynchrone
router.post("/", async (req, res) => {
  try {
    const quiz = await Result.create(Object.assign({}, req.body));
    res.status(201).json(quiz);
  } catch (err) {
    console.log(err);
    manageAllErrors(res, err);
  }
});

//Afin de l'utiliser ailleurs, on exporte le routeur
module.exports = router;
