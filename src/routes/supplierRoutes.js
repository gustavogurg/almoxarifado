import { Router } from "express";
import supplierController from "../controllers/supplierController.js";
import authenticate from "../middlewares/authenticate.js";

const router = Router();

router.get("/", authenticate, supplierController.index);
router.get("/:id", authenticate, supplierController.show);

router.post("/", authenticate, supplierController.store);
router.put("/:id", authenticate, supplierController.update);
router.delete("/:id", authenticate, supplierController.destroy);

export default router;
