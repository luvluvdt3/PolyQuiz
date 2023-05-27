//Classe de modèle pour les réponses.

//Afin de valider les objets JS, on va utiliser la bibliothèque de validation joi.
const validation = require("joi");

//Exportation du modèle de bases de nos modèles.
const BaseModel = require("../utils/base-model.js");

//Exportation d'un AnswerModèle, dérivant du modèle de base et prenant en compte tous les attributs définissant une réponse.
module.exports = new BaseModel("Answer", {
  questionId: validation.number().required(),
  answer_text: validation.string(),
  answer_image: validation.string(),
  isCorrect: validation.boolean().required(),
});
