const express = require("express");
const Router = express.Router();
const { transactionController } = require("../controller");
const { tokenVerify } = require("../middleware/verifyToken");
const upload = require("../middleware/upload");

Router.get("/", tokenVerify, transactionController.getTransaction);
Router.patch("/status/received", tokenVerify, transactionController.received);
Router.patch("/status/cancel", tokenVerify, transactionController.cancel);

module.exports = Router;
