const { Router } = require("express");

const { Notification } = require("../../models");
const manageAllErrors = require("../../utils/routes/error-management");

const router = new Router();

// router.get("/", (req, res) => {
//   try {
//     res.status(200).json(Notification.get());
//   } catch (err) {
//     manageAllErrors(res, err);
//   }
// });

router.get("/", async (req, res) => {
  try {
    const notifications = await Notification.get();
    res.status(200).json(notifications);
  } catch (error) {
    manageAllErrors(res, error);
  }
});

// router.post("/", (req, res) => {
//   try {
//     const notification = Notification.create({ ...req.body });
//     res.status(201).json(notification);
//   } catch (err) {
//     manageAllErrors(res, err);
//   }
// });

router.post("/", async (req, res) => {
  try {
    const newNotification = await Notification.create(req.body);
    res.status(201).json(newNotification);
  } catch (error) {
    manageAllErrors(res, error);
  }
});

router.get("/:receiverId", (req, res) => {
  try {
    const notification = Notification.getByUserId(req.params.receiverId);
    res.status(200).json(notification);
  } catch (err) {
    res.status(404).json(err);
  }
});

module.exports = router;
