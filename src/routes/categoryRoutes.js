import { Router } from "express";
import categoryController from "../controllers/categoryController.js";

const router = Router();

router.get("/", categoryController.index);
router.get("/:id", categoryController.show);

router.post("/", categoryController.store);
router.put("/:id", categoryController.update);
router.delete("/:id", categoryController.destroy);

export default router;
