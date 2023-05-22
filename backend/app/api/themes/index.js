const { Router } = require("express");
const { Theme } = require("../../models");
const manageAllErrors = require("../../utils/routes/error-management");

const router = new Router();

// router.get("/", (req, res) => {
//   try {
//     res.status(200).json(Theme.get());
//   } catch (err) {
//     manageAllErrors(res, err);
//   }
// });

router.get("/", async (req, res) => {
  try {
    const themes = await Theme.get();
    res.status(200).json(themes);
  } catch (err) {
    manageAllErrors(res, err);
  }
});

// router.get("/:themeId", (req, res) => {
//   try {
//     res.status(200).json(Theme.getById(req.params.themeId));
//   } catch (err) {
//     manageAllErrors(res, err);
//   }
// });

router.get("/:themeId", async (req, res) => {
  try {
    const theme = await Theme.getById(req.params.themeId);
    res.status(200).json(theme);
  } catch (err) {
    manageAllErrors(res, err);
  }
});

// router.post("/", (req, res) => {
//   try {
//     const theme = Theme.create({ ...req.body });
//     res.status(201).json(theme);
//   } catch (err) {
//     manageAllErrors(res, err);
//   }
// });

router.post('/', async (req, res) => {
    try {
        const theme = await Theme.create({...req.body});
        res.status(201).json(theme);
    } catch (err) {
        manageAllErrors(res, err);
    }
});

// router.put("/:themeId", (req, res) => {
//   try {
//     res.status(200).json(Theme.update(req.params.themeId, req.body));
//   } catch (err) {
//     manageAllErrors(res, err);
//   }
// });

router.put('/:themeId', async (req, res) => {
    try {
        const updatedTheme = await Theme.update(req.params.themeId, req.body);
        res.status(200).json(updatedTheme);
    } catch (err) {
        manageAllErrors(res, err);
    }
});

// router.delete("/:themeId", (req, res) => {
//   try {
//     Theme.delete(req.params.themeId);
//     res.status(204).end();
//   } catch (err) {
//     manageAllErrors(res, err);
//   }
// });

router.delete("/:themeId", async (req, res) => {
  try {
    await Theme.delete(req.params.themeId);
    res.status(204).end();
  } catch (err) {
    manageAllErrors(res, err);
  }
});

module.exports = router;
