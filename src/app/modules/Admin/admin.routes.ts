import { NextFunction, Request, Response, Router } from "express";
import { adminController } from "./admin.controller";

import validateRequest from "../../middlewares/validateRequest";
import { AdminValidations } from "./admin.validation";

const router =Router();

router.get("/",adminController.getAdmin)
router.get("/:id",adminController.getAdminById)
router.patch("/:id",validateRequest(AdminValidations.update),adminController.updateAdmin)
router.delete("/:id",adminController.deleteAdmin)
router.delete("/soft/:id",adminController.softDeleteAdmin)

export const adminRoutes = router;