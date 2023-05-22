//Classe de modèle pour les questions au niveau du backend. Chaque fichier se base sur le modèle de base de modèle
//puis exporte ses attributs (ici par exemple, un questions a un nombre, le texte de la question, l'image de la question
//, le son de la question, le texte de l'explication, l'image de l'explication et les réponses)

//Afin de valider les objets JS, on va utiliser la bibliothèque de validation joi.
const validation = require("joi");

//Et exporter le modèle de base de nos modèles.
const BaseModel = require("../utils/base-model.js");

//Enfin, on va exporter un nouveau modèle qui va hériter du modèle de base et qui va définir les attributs d'un quiz.
module.exports = new BaseModel("Question", {
  quizId: validation.number(),
  question_text: validation.string().required(),
  question_image: validation.string(),
  question_sound: validation.string(),
  explain_text: validation.string().required(),
  explain_image: validation.string(),
  answers: validation.array(),
});
