//Imports de la classe
const { Router } = require("express");

const { Settings } = require("../../models");
const manageAllErrors = require("../../utils/routes/error-management");

//Creation du routeur de la classe
const router = new Router();

//Récupération (GET) de la route / (donc de tous les settings)
router.get("/", (req, res) => {
  try {
    res.status(200).json(Settings.get());
  } catch (err) {
    manageAllErrors(res, err);
  }
});

// Récupération (GET) des settings associé à l'user ayant pour id user_id
router.get("/:user_id", (req, res) => {
  try {
    const user_id = parseInt(req.params.user_id);
    const settings = Settings.findOne({ user_id });
    res.status(200).json(settings);
  } catch (err) {
    manageAllErrors(res, err);
  }
});

// Création (POST) d'un setting
router.post("/", (req, res) => {
  try {
    const settings = Settings.create(Object.assign({}, req.body));
    res.status(201).json(settings);
  } catch (err) {
    manageAllErrors(res, err);
  }
});

// Mise à jour (PUT) des settings associés à l'user ayant pour id user_id
router.put("/:user_id", (req, res) => {
  try {
    const user_id = parseInt(req.params.user_id);
    //Pas besoin de créer un manager spécifique pour la gestion des settings : la classe mère base-model.js suffit
    const settings = Settings.findOne({ user_id });
    const result = Settings.update(settings.id, req.body);
    res.status(200).json(result);
  } catch (err) {
    manageAllErrors(res, err);
  }
});

//Exportation du routeur afin de pouvoir l'utiliser dans un autre fichier javascript
module.exports = router;
