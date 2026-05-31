import { Router } from "express";
import productController from "../controllers/productController.js";

const router = Router();

router.get("/", productController.index);
router.get("/:id", productController.show);

router.post("/", productController.store);
router.put("/:id", productController.update);
router.delete("/:id", productController.destroy);

export default router;