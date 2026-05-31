import { Router } from "express";
import stockMovementController from "../controllers/stockMovementController.js";

const router = Router();

router.get("/", stockMovementController.index);
router.get("/:id", stockMovementController.show);

router.post("/", stockMovementController.store);
router.put("/:id", stockMovementController.update);
router.delete("/:id", stockMovementController.destroy);

export default router;
