import { Router } from "express";
import stockMovementController from "../controllers/stockMovementController.js";
import authenticate from "../middlewares/authenticate.js";

const router = Router();

router.get("/", authenticate, stockMovementController.index);
router.get("/product/:productId", authenticate, stockMovementController.findByProductId); // rota faltou
router.get("/:id", authenticate, stockMovementController.show);

router.post("/", authenticate, stockMovementController.store);
// router.put("/:id", authenticate, stockMovementController.update);
// router.delete("/:id", authenticate, stockMovementController.destroy);

export default router;