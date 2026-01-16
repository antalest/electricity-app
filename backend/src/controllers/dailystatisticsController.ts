import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import { Decimal } from '@prisma/client/runtime/client';

export const getDailystatistics = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Query daily averages
    const dailyAverages = await prisma.electricitydata.groupBy({
      by: ['date'],
      _avg: {
        hourlyprice: true,
      },
      _sum: {
        consumptionamount: true,
        productionamount: true,
      },
      orderBy: {
        date: 'asc',
      },
    });

    //Query hourly prices
    const hourlyPrices = await prisma.electricitydata.findMany({
      select: {
        hourlyprice: true,
        starttime: true,
        date: true,
      },
      orderBy: {
        starttime: 'asc',
      },
      take: 35000,
    });


    //Iterate through hourly prices and save the longest negative price streak to a map for each day
    const negativePriceStreakMap = new Map<string, number>();
    let date: Date | null = null;
    let starttime: Date | null = null;
    let consecutiveHours: number = 0;

    hourlyPrices?.forEach((element) => {
      // Skip to the next element if there are null values
      if (!element.hourlyprice || !element.date || !element.starttime) return;

      // Skip to the next element if the price is positive
      if (element.hourlyprice && element.hourlyprice >= Decimal(0)) return;

      // Initialize the date and starttime for the first iteration
      if (element.date && !date && element.starttime && !starttime) {
        date = new Date(element.date.getTime());
        starttime = new Date(element.starttime.getTime());
      }

      // Reset the consecutive hours counter if the date has changed
      if (date?.getTime() != element.date?.getTime()) {
        consecutiveHours = 0;
        date = new Date(element.date.getTime());
      }

      // Reset the consecutive hours counter if the streak is lost i.e. the last starttime is more than 1 hour
      if (
        starttime &&
        element.starttime.getTime() - starttime.getTime() != 1 * 60 * 60 * 1000
      ) {
        consecutiveHours = 0;
      }

      //Update starttime
      starttime = new Date(element.starttime.getTime());

      // Increase streak
      consecutiveHours++;

      // If date is already in map, update record streak
      if (negativePriceStreakMap.has(date.toJSON())) {
        const value = negativePriceStreakMap.get(date.toJSON());

        if (value && value < consecutiveHours) {
          negativePriceStreakMap.set(date.toJSON(), consecutiveHours);
        }

        //And return
        return;
      }

      //Othwerwise add new key value pair
      negativePriceStreakMap.set(date.toJSON(), consecutiveHours);
    });

    //Response model
    interface DailyStatistics {
      date: string | null;
      total_production_amount: Decimal | null;
      total_consumption_amount: Decimal | null;
      avg_hourly_price: Decimal | null;
      max_negative_price_streak_hours: number | null;
    }

    const response = new Array<DailyStatistics>();

    //Combine daily averages and negative hourly price streak data to the response
    dailyAverages.forEach((element) => {
      let negativePriceStreak: number = 0;
      if (element.date && negativePriceStreakMap.has(element.date?.toJSON())) {
        negativePriceStreak = negativePriceStreakMap.get(
          element.date.toJSON(),
        )!;
      }

      response.push({
        date: element.date ? element.date.toJSON().split('T')[0] : null,
        total_production_amount: element._sum.productionamount,
        total_consumption_amount: element._sum.consumptionamount,
        avg_hourly_price: element._avg.hourlyprice,
        max_negative_price_streak_hours: negativePriceStreak,
      });
    });

    res.json(response);
    
  } catch (error) {
    next(error);
  }
};
