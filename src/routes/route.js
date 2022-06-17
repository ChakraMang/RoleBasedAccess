const express = require('express');
const router = express.Router();
const controller = require('../controller/controller')

router.post("/create",controller.create);
router.post("/login",controller.login)
router.get('/read',controller.read);
router.put('/update',controller.update)

module.exports = router;