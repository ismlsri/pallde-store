import { Router, type IRouter } from "express";
import healthRouter from "./health";
import competitorRouter from "./competitor-analysis";

const router: IRouter = Router();

router.use(healthRouter);
router.use(competitorRouter);

export default router;
