import { Router } from "express";
import productController from "../controllers/productController.js";
import authenticate from "../middlewares/authenticate.js";

const router = Router();

router.get("/", authenticate, productController.index);
router.get("/:id", authenticate, productController.show);

router.post("/", authenticate, productController.store);
router.put("/:id", authenticate, productController.update);
router.delete("/:id", authenticate, productController.destroy);

export default router;