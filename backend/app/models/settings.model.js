//Classe de modèle pour les paramètres au niveau du backend. Chaque fichier se base sur le modèle de base des modèles
//puis exporte ses attributs (ici par exemple, un paramètre est référencé par l'id de son utilisateur associé,
//a un booléen pour l'activation du son, une string pour l'option de la souris,
//un string pour le micro et un booléen pour la confirmation de réponse.)

//Affectation de la bibliothèque de validation joi à une constante.
const validation = require("joi");
//Importation du modèle de base des modèles.
const BaseModel = require("../utils/base-model.js");

//Exportation d'un nouveau modèle qui va hériter du modèle de base et qui va définir les attributs d'un paramètre.
module.exports = new BaseModel("Settings", {
  user_id: validation.number().required(),
  sound_effect: validation.boolean().required(),
  mouse_option: validation.string().required(),
  microphone: validation.string().required(),
  confirm_answer: validation.boolean().required(),
});
