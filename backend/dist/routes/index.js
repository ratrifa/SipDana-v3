"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./auth.routes"));
const report_routes_1 = __importDefault(require("./report.routes"));
const transaction_routes_1 = __importDefault(require("./transaction.routes"));
const target_routes_1 = __importDefault(require("./target.routes")); // <-- Import routes baru
const router = (0, express_1.Router)();
router.use('/auth', auth_routes_1.default);
router.use('/reports', report_routes_1.default);
router.use('/transactions', transaction_routes_1.default);
router.use('/targets', target_routes_1.default); // <-- Daftarkan routes baru
exports.default = router;
