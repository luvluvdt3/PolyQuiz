//Dans cette classe, on ne va pas se contenter de simples routes pour récupérer, créer, mettre à jour ou supprimer
//des données en rapport avec les user. En effet, on va également gérer les sessions utilisateur, ce qui
//demande un peu plus de travail que la plupart des autres index.js.

//Imports utile à la classe
const { Router } = require("express");
//Import relatif à la gestion des sessions utilisateur
const session = require("express-session");

const { User } = require("../../models");
const manageAllErrors = require("../../utils/routes/error-management");
//Creation du routeur de la classe
const router = new Router();

//import de bcrypt pour le hashage de mots de passe.
const bcrypt = require("bcrypt");

const SESSION_LIFETIME = 1000 * 60 * 60 * 24 * 30; //faire en sorte que la sesssion dure 30 jours.
const SESSION_NAME = "login";
const SESSION_SECRET = "ps6login";

//Permet de stocker les sessions dans des fichiers.
var FileStore = require("session-file-store")(session);

//Stockage de l'état de connexion du user dans une variable.
const isConnected = (req) => {
  return req.session.userId !== undefined;
};

//Récupération (GET) de la route / (donc de tous les users de notre base de données)
router.get("/", (req, res) => {
  try {
    res.status(200).json(User.get());
  } catch (err) {
    manageAllErrors(res, err);
  }
});

//Utilisation d'une fonction middleware pour contrôler les requêtes HTTP
router.use(function (req, res, next) {
  //Contrôle du CORS, mécanisme de sécrurité qui permet de contrôler les requêtes HTTP.
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:4200");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  //On autoprise les cookies
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

//Configuration du middleware de gestion des sessions
router.use(
  session({
    //Stockage de session
    store: new FileStore({}),
    name: SESSION_NAME,
    //On ne sauvegarde pas la session à chaque requête
    resave: false,
    saveUninitialized: true,
    secret: SESSION_SECRET,
    cookie: {
      maxAge: SESSION_LIFETIME,
      secure: false,
      sameSite: true,
    },
  })
);

// Création (POST) d'un user, de manière asynchrone (async)
router.post("/", async (req, res) => {
  try {
    const { userName, password, avatar } = req.body;
    //Methode de la classe mère des modèles
    const existingUser = await User.findOne({ userName });
    if (existingUser) {
      return res.status(409).json({ error: "L'utilisateur existe déjà." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create(
      Object.assign({}, req.body, {
        userName: userName,
        password: hashedPassword,
        avatar: avatar,
      })
    );
    res.status(201).json(user);
  } catch (err) {
    console.log(err);
    manageAllErrors(res, err);
  }
});

// Mise à jour (PUT) de l'user ayant pour id userid
router.put("/:userId", (req, res) => {
  try {
    res.status(200).json(User.update(req.params.userId, req.body));
  } catch (err) {
    console.log(err);
    manageAllErrors(res, err);
  }
});

//Suppression (DELETE) de l'user ayant pour id userid
router.delete("/:userId", (req, res) => {
  try {
    User.delete(req.params.userId);
    res.status(204).end();
  } catch (err) {
    manageAllErrors(res, err);
  }
});

// Création (POST) d'une route spécifique à l'authentification d'un user
router.post("/login", async (req, res) => {
  try {
    const { userName, password } = req.body;
    const existingUser = await User.findOne({ userName });
    //On vérifie que l'utilisateur existe bien
    if (!existingUser) {
      return res.status(409).json({ error: "userName doesn't exist" });
    }
    //Comparaison du mot de passe entré avec celui stocké dans la base de données.
    if (await bcrypt.compare(password, existingUser.password)) {
      req.session.userId = existingUser.id;
      return res.status(200).json(existingUser);
    } else {
      return res.status(200).json({ errors: "Wrong password" });
    }
  } catch (err) {
    console.log(err);
    manageAllErrors(res, err);
  }
});

//Récupération (GET) de la route /login, ce qui correspond à la récupération de l'utilisateur en fonction de la route de sa session
router.get("/login", async (req, res) => {
  try {
    console.log(req.session.userId);
    if (req.session.userId !== undefined) {
      const existingUser = await User.findOne({ id: req.session.userId });
      console.log(existingUser);
      return res.status(200).json(existingUser);
    }
    if (req.body.userName !== undefined) {
      const existingUser = await User.findOne({ userName: userName });
      console.log(existingUser);
      return res.status(200).json(existingUser);
    }
    return res.status(200).json({});
  } catch (err) {
    console.log(err);
    manageAllErrors(res, err);
  }
});

//Récupération (GET) de la route /logout, ce qui correspond à la récupération des routes de déconnexion
router.get("/logout", (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        return res.status(200).json({ success: false });
      }
      //Supression du cookie
      res.clearCookie(SESSION_NAME);
      console.log("Logged out");
      return res.status(200).json({ success: true });
    });
  } catch (err) {
    manageAllErrors(res, err);
  }
});

//Exportation du routeur afin de pouvoir l'utiliser dans un autre code js
module.exports = router;
