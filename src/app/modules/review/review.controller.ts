import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ReviewService } from './review.service';
import { IJwtPayload } from '../auth/auth.interface';

const createReview = catchAsync(async (req, res) => {
   const user = req.user as unknown as IJwtPayload;
   const review = req.body;
   const result = await ReviewService.createReviewIntoDB(review, user);

   sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: 'Review created successfully',
      data: result,
   });
});

const getAllReviews = catchAsync(async (req, res) => {
   const result = await ReviewService.getAllReviewsFromDB(req.query);

   sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Reviews fetched successfully',
      data: result,
   });
});

const deleteReview = catchAsync(async (req, res) => {
   const { reviewId } = req.params;
   const user = req.user as unknown as IJwtPayload;
   const result = await ReviewService.deleteReviewFromDB(reviewId, user);

   sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Review deleted successfully',
      data: result,
   });
});

export const ReviewControllers = {
   createReview,
   getAllReviews,
   deleteReview,
};
