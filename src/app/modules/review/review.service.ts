
import { IReview } from './review.interface';
import { Review } from './review.model';
import { JwtPayload } from 'jsonwebtoken';

import QueryBuilder from '../../builder/QueryBuilder';
import mongoose from 'mongoose';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import Medicine from '../medicine/medicine.model';


const createReview = async (payload: IReview, user: JwtPayload) => {
   const session = await mongoose.startSession();

   try {
      session.startTransaction();

      const existingReview = await Review.findOne(
         {
            user: user.userId,
            product: payload.product,
         },
         null,
         { session }
      );

      if (existingReview) {
         throw new AppError(
            httpStatus.BAD_REQUEST,
            'You have already reviewed this product.'
         );
      }

      const review = await Review.create([{ ...payload, user: user.userId }], {
         session,
      });

      // Aggregate reviews for the product
      const reviews = await Review.aggregate([
         {
            $match: {
               product: review[0].product,
            },
         },
         {
            $group: {
               _id: null,
               averageRating: { $avg: '$rating' },
               ratingCount: { $sum: 1 },
            },
         },
      ]);

      const { averageRating = 0, ratingCount = 0 } = reviews[0] || {};

      const updatedProduct = await Medicine.findByIdAndUpdate(
         payload.product,
         { averageRating, ratingCount },
         { session, new: true }
      );

      if (!updatedProduct) {
         throw new AppError(
            httpStatus.NOT_FOUND,
            'Product not found during rating update.'
         );
      }

      await session.commitTransaction();
      return review;
   } catch (err) {
      await session.abortTransaction();
      throw err;
   } finally {
      session.endSession();
   }
};

const getAllReviews = async (query: Record<string, unknown>) => {
   const brandQuery = new QueryBuilder(
      Review.find().populate('product user'),
      query
   )
      .search(['review'])
      .filter()
      .sort()
      .paginate()
      .fields();

   const result = await brandQuery.modelQuery;
   const meta = await brandQuery.countTotal();

   return {
      meta,
      result,
   };
};

export const ReviewServices = {
   createReview,
   getAllReviews,
};
