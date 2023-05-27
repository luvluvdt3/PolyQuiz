//Ce finit définit l'index de tous nos modèles. Au sein de celui ci, on va simplement importer tous les modèles de notre back,
//puis les exporter. Regrouper tous les imports dans un même fichier nous paraît plus proche, et permets d'avoir une structure mieux organisée.
const Quiz = require("./quiz.model.js");
const Question = require("./question.model.js");
const Answer = require("./answer.model.js");

const Result = require("./result.model.js");
const User = require("./user.model.js");
const Resident = require("./resident.model.js");
const Theme = require("./theme.model.js");
const Settings = require("./settings.model.js");
const InitSettings = require("./initsettings.model.js");
module.exports = {
  User,
  Resident,
  Quiz,
  Theme,
  Question,
  Answer,
  Result,
  Settings,
  InitSettings,
};
