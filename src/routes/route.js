const express = require('express');
const router = express.Router();
const controller = require('../controller/controller')
const auth = require("../middleware/middleware");

router.post("/create",controller.create);
router.post("/login",controller.login)
router.get('/read/:userId',auth.loginCheck, auth.accessCheck('readAny',"details"),controller.read);
router.put('/update/:userId',auth.loginCheck, auth.accessCheck('readAny',"details"),controller.update)

module.exports = router;