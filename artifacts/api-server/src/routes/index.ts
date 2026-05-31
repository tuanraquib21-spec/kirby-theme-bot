import { Router, type IRouter } from "express";
import healthRouter from "./health";
import discordStatsRouter from "./discord-stats";
import discordInteractionsRouter from "./discord-interactions";

const router: IRouter = Router();

router.use(healthRouter);
router.use(discordStatsRouter);
router.use(discordInteractionsRouter);

export default router;
