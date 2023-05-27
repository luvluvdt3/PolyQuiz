//Imports de la classe. Ce fichier est lié à la gestion des routes pour les questions.

const AnswersRouter = require("./answers");
const { filterQuestionsFromQuizz, getQuestionFromQuiz } = require("./manager");
const { Router } = require("express");

const manageAllErrors = require("../../../utils/routes/error-management");
const { Answer, Quiz, Question } = require("../../../models");

//Creation du routeur avec le paramètre mergeParams à true. Cela siginifie que les paramètres de la requête seront conservés.
const router = new Router({ mergeParams: true });

//Récupération (GET) de la route / (donc de toutes les questions)
router.get("/", (req, res) => {
  try {
    //Récupérations de tous les quiz via la variable req
    const questions = Quiz.getById(req.params.quizId);
    res.status(200).json(questions);
  } catch (err) {
    manageAllErrors(res, err);
  }
});

//Récupération (GET) de la question ayant pour id questionId
router.get("/:questionId", (req, res) => {
  try {
    const question = getQuestionFromQuiz(
      req.params.quizId,
      req.params.questionId
    );
    res.status(200).json(question);
  } catch (err) {
    manageAllErrors(res, err);
  }
});

// Création (POST) d'une question
router.post("/", (req, res) => {
  try {
    //Récupérations de tous les quiz via la variable req
    const quizId = parseInt(req.params.quizId, 10);
    let question = {
      question_text: req.body.question_text,
      explain_text: req.body.explain_text,
      quizId,
    };
    //Paramètres optionnels de la question
    if (req.body.explain_image) {
      question.explain_image = req.body.explain_image;
    }
    if (req.body.question_image) {
      question.question_image = req.body.question_image;
    }
    if (req.body.question_sound) {
      question.question_sound = req.body.question_sound;
    }
    question = Question.create(question);

    // Si les réponses ont été fournis par l'utilisateur dans la requête alors on les créent également.
    if (req.body.answers && req.body.answers.length > 0) {
      const answers = req.body.answers.map((answer) =>
        Answer.create(Object.assign({}, answer, { questionId: question.id }))
      );
      question = Object.assign({}, question, { answers });
    }
    res.status(201).json(question);
  } catch (err) {
    manageAllErrors(res, err);
  }
});

// Mise à jour (PUT) de la question ayant pour id questionId
router.put("/:questionId", (req, res) => {
  try {
    const question = getQuestionFromQuiz(
      req.params.quizId,
      req.params.questionId
    );
    let updatedQuestion = {
      question_text: req.body.question_text,
      explain_text: req.body.explain_text,
      quizId,
    };
    //Paramètres optionnels de la question
    if (req.body.explain_image) {
      question.explain_image = req.body.explain_image;
    }
    if (req.body.question_image) {
      question.question_image = req.body.question_image;
    }
    if (req.body.question_sound) {
      question.question_sound = req.body.question_sound;
    }

    Question.update(req.params.questionId, updatedQuestion);
    res.status(200).json(updatedQuestion);
  } catch (err) {
    manageAllErrors(res, err);
  }
});

//Suppression (DELETE) de la question ayant pour id questionId
router.delete("/:questionId", (req, res) => {
  try {
    getQuestionFromQuiz(req.params.quizId, req.params.questionId);
    Question.delete(req.params.questionId);
    res.status(204).end();
  } catch (err) {
    manageAllErrors(res, err);
  }
});

//Affecte le answersRouter au routeur via l'URL quizId/questions/questionId/answers (donc gestion des réponses par ce answersRouteur)
router.use("/:questionId/answers", AnswersRouter);

//Exportation du routeur afin de pouvoir l'utiliser dans un autre code js
module.exports = router;
