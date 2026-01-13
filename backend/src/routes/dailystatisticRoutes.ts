import { Router } from 'express';
import { getDailystatistics } from '../controllers/dailystatisticsController';

const router = Router();

router.get('/', getDailystatistics);

export default router;