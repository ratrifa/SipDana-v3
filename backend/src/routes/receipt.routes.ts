import { Router } from "express";
import multer from "multer";
import { scanReceipt } from "../controllers/receipt.controller";
import { protect } from "../middleware/auth.middleware";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.use(protect);

// Upload form field name: "receipt"
router.post("/scan-receipt", upload.single("receipt"), scanReceipt);

export default router;
