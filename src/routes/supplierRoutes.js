import { Router } from "express";
import supplierController from "../controllers/supplierController.js";

const router = Router();

router.get("/", supplierController.index);
router.get("/:id", supplierController.show);

router.post("/", supplierController.store);
router.put("/:id", supplierController.update);
router.delete("/:id", supplierController.destroy);

export default router;
