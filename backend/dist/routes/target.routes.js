"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const target_controller_1 = require("../controllers/target.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.protect);
// [POST] /api/targets/
router.post('/', target_controller_1.createTarget);
// [GET] /api/targets/
router.get('/', target_controller_1.getActiveTargets);
// [POST] /api/targets/contribute
router.post('/contribute', target_controller_1.contributeToTarget);
exports.default = router;
