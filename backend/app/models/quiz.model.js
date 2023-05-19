//Classe de modèle pour les quiz au niveau du backend. Chaque fichier se base sur le modèle de base de modèle
//puis exporte ses attributs (ici par exemple, un quiz a un nom, une difficulté, une image, une description
//, un temps estimé et un thème associé.)

//Afin de valider les objets JS, on va utiliser la bibliothèque de validation joi.
const validation = require("joi");

//Et exporter le modèle de base de nos modèles.
const BaseModel = require("../utils/base-model.js");

//Enfin, on va exporter un nouveau modèle qui va hériter du modèle de base et qui va définir les attributs d'un quiz.
module.exports = new BaseModel("Quiz", {
  name: validation.string().required(),
  difficulty: validation.string().required(),
  image: validation.string().required(),
  description: validation.string().required(),
  estimated_time: validation.number().integer().required(),
  themeId: validation.number().integer().required(),
});
