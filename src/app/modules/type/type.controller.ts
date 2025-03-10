import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { IImageFile } from '../../interface/IImageFile';
import sendResponse from '../../utils/sendResponse';
import { IJwtPayload } from '../auth/auth.interface';
import httpStatus from 'http-status';
import { TypeService } from './type.service';

const createType = catchAsync(async (req: Request, res: Response) => {
   const result = await TypeService.createType(
      req.body,
      req.file as IImageFile,
      req.user as IJwtPayload
   );

   sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Type created successfully',
      data: result,
   });
});

const getAllType = catchAsync(async (req, res) => {
   const result = await TypeService.getAllType(req.query);

   sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Types are retrieved successfully',
      meta: result.meta,
      data: result.result,
   });
});

const updateTypeIntoDB = catchAsync(async (req, res) => {
   const { id } = req.params;
   const result = await TypeService.updateTypeIntoDB(
      id,
      req.body,
      req.file as IImageFile,
      req.user as IJwtPayload
   );

   sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Type is updated successfully',
      data: result,
   });
});

const deleteTypeIntoDB = catchAsync(async (req, res) => {
   const { id } = req.params;
   const result = await TypeService.deleteTypeIntoDB(
      id,
      req.user as IJwtPayload
   );

   sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Type is deleted successfully',
      data: result,
   });
});

export const TypeController = {
   createType,
   getAllType,
   updateTypeIntoDB,
   deleteTypeIntoDB
};
