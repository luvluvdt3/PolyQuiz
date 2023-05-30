//Classe de modèle pour les résultats au niveau du backend. Chaque fichier se base sur le modèle de base de modèle
//puis exporte ses attributs (ici par exemple, un résultat  à un user_id, un quiz_id, des tableaux de bonnes et mauvaises réponses
//, un temps de jeu, une date, un temps par question et un compteur de "mauvais cliques".)

//Afin de valider les objets JS, on va utiliser la bibliothèque de validation joi.
const validation = require("joi");
//Et exporter le modèle de base de nos modèles.
const BaseModel = require("../utils/base-model.js");

//Enfin, on va exporter un nouveau modèle qui va hériter du modèle de base et qui va définir les attributs d'un résultat.
module.exports = new BaseModel("Result", {
  user_id: validation.number().required(),
  quiz_id: validation.number().required(),
  right_answers: validation.number().required(),
  wrong_answers: validation.number().required(),
  play_time: validation.number().required(), // en seconde
  date: validation.date().required(),
  time_per_question: validation.number().required(),
  click_error: validation.number().required().default(-1),
});
