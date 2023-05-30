//Imports de la calsse
const { Result } = require("../../models");
const logger = require("../../utils/logger.js");

// Méthode qui va permettre de créer un résultat en fonction de son id, en se servant des données de la base de données.
const buildResult = (resultId) => {
  const result = Result.getById(resultId);
  return { result };
};

/**
 * Méthode qui, a partir des questions et des réponses de la base de données,
 * va créer les résultats.
 */
const buildResults = () => {
  const results = Result.get();
  return results.map((result) => buildResult(result.id));
};

//Exportation des méthodes
module.exports = {
  buildResults,
};
