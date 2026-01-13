import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';

// Read all items
export const getDailystatistics = (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json({"message" : "daily stats!"});
  } catch (error) {
    next(error);
  }
};