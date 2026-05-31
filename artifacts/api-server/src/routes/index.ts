import { Router, type IRouter } from "express";
import healthRouter from "./health";
import discordStatsRouter from "./discord-stats";

const router: IRouter = Router();

router.use(healthRouter);
router.use(discordStatsRouter);

export default router;
