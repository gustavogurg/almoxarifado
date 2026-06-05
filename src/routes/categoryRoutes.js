import { Router } from "express";
import categoryController from "../controllers/categoryController.js";
import authenticate from "../middlewares/authenticate.js";

const router = Router();

router.get("/", authenticate, categoryController.index);
router.get("/:id", authenticate, categoryController.show);

router.post("/", authenticate, categoryController.store);
router.put("/:id", authenticate, categoryController.update);
router.delete("/:id", authenticate, categoryController.destroy);

export default router;
