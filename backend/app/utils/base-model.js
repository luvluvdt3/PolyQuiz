//Classe qui définit le modèle de base de nos modèles.
//Imports
//On importe joi qui sert à valider les objets javascript.
const validation = require("joi");
//On importe fs qui sert à la manipulation de fichier (lecture, écriture, ...)
const filesystem = require("fs");

//Imports de classes d'exceptions
const ValidationError = require("./errors/validation-error.js");
const NotFoundError = require("./errors/not-found-error.js");

//Export de la classe BaseModel, qui servira de base pour tous nos futurs modèles.
module.exports = class BaseModel {
  constructor(name, schema) {
    if (!name)
      throw new Error("You must provide a name in constructor of BaseModel");
    if (!schema)
      throw new Error("You must provide a schema in constructor of BaseModel");
    this.name = name;
    this.schema = validation
      .object()
      .keys({ ...schema, id: validation.number().required() });
    this.items = [];
    this.filePath = `${__dirname}/../../database/${this.name.toLowerCase()}.data.json`;
    this.load();
  }

  //Méthode qui permet de charger les données d'un fichier JSON dans un tableau d'objets javascript.
  load() {
    try {
      //lecture du fichier, parsé par le JSON, et affecté au tableau items.
      this.items = JSON.parse(filesystem.readFileSync(this.filePath, "utf8"));
    } catch (error) {
      if (error.message === "Unexpected end of JSON input")
        console.log(`Warning : ${this.filePath} has wrong JSON format`);
    }
  }

  //Methode qui permet de sauvegarder les données d'un tableau d'objets javascript dans un fichier JSON.
  save() {
    try {
      //ecriture dans le fichier présent à l'emplacement filePath, du tableau items, parsé en JSON.
      filesystem.writeFileSync(
        this.filePath,
        JSON.stringify(this.items, null, 2),
        "utf8"
      );
    } catch (err) {
      console.log(`Error while trying to save ${this.name}`);
    }
  }

  //Methode qui cree un nouvel élément en fonction d'un objet passé en paramètre, et qui le sauvegarde dans le fichier JSON.
  create(obj = {}) {
    const item = Object.assign({}, obj, { id: Date.now() });
    const { error } = validation.validate(item, this.schema);
    if (error)
      throw new ValidationError(
        `Create Error : Object ${JSON.stringify(
          obj
        )} does not match schema of model ${this.name}`,
        error
      );
    this.items.push(item);
    this.save();
    return item;
  }

  //Methode qui modifier et mets à jour un élément en fonction de son id et d'un objet passé en paramètre, et qui le sauvegarde dans le fichier JSON.
  update(id, obj) {
    if (typeof id === "string") id = parseInt(id, 10);
    const prevObjIndex = this.items.findIndex((item) => item.id === id);
    if (prevObjIndex === -1)
      throw new NotFoundError(
        `Cannot update ${this.name} id=${id} : not found`
      );
    const updatedItem = Object.assign({}, this.items[prevObjIndex], obj);
    const { error } = validation.validate(updatedItem, this.schema);
    if (error)
      throw new ValidationError(
        `Update Error : Object ${JSON.stringify(
          obj
        )} does not match schema of model ${this.name}`,
        error
      );
    this.items[prevObjIndex] = updatedItem;
    this.save();
    return updatedItem;
  }

  //Methode qui supprime l'élément d'id id.
  delete(id) {
    if (typeof id === "string") id = parseInt(id, 10);
    const objIndex = this.items.findIndex((item) => item.id === id);
    if (objIndex === -1)
      throw new NotFoundError(
        `Cannot delete ${this.name} id=${id} : not found`
      );
    //La methode filter va retourner uniquement les objets du tableau qui correspondent à la condition.
    //Ainsi, on va retourner tous les éléments du tableau sauf celui dont l'id correspond à l'élément que nous souhaitons supprimer.
    this.items = this.items.filter((item) => item.id !== id);
    this.save();
  }

  //Méthode qui echerche un élément correspondant aux conditions spécifiées
  findOne(condition) {
    const item = this.items.find((i) => {
      for (const key in condition) {
        if (condition[key] !== i[key]) {
          return false;
        }
      }
      return true;
    });

    if (!item) return false;

    return item;
  }

  //Methode qui retourne tous les éléments de la liste
  get() {
    return this.items;
  }

  //Méthode qui renvoit un élément de la liste en fonction de son id.
  getById(id) {
    if (typeof id === "string") id = parseInt(id, 10);

    const item = this.items.find((i) => i.id === id);

    if (!item)
      throw new NotFoundError(`Cannot get ${this.name} id=${id} : not found`);

    return item;
  }

  //Méthode qui renvoit des élément de la liste en fonction de l'id de l'utilisateur.
  getByUserId(id) {
    if (typeof id === "string") id = parseInt(id);

    const items = this.items.filter((item) => item.user_id === id);

    if (!items) return false;

    return items;
  }

  //Méthode qui renvoit des élément de la liste en fonction de l'id du quiz.
  getByQuizId(id) {
    if (typeof id === "string") id = parseInt(id);

    const items = this.items.filter((item) => item.quiz_id === id);

    if (!items) return false;

    return items;
  }
};
