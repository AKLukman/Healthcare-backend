import { NextFunction, Request, RequestHandler, Response } from "express";
import { adminServices } from "./admin.services";
import pick from "../../shared/pick";
import { adminFilterAbleFields } from "./admin.constant";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status"
import catchAsync from "../../shared/catchAsync";




const getAdmin:RequestHandler =catchAsync(async(req:Request,res:Response)=>{
    const filters = pick(req.query,adminFilterAbleFields)
    const options = pick(req.query,['limit','page','sortBy','sortOrder'])
   
    const result = await adminServices.getAdmin(filters,options);
    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:"Admin retrived successfully!",
        meta:result.meta,
        data:result.data
    })
   
})

const getAdminById = catchAsync(async (req:Request,res:Response)=>{
    const {id} = req.params
   
    const result = await adminServices.getAdminById(id);
    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:"Admin retrived successfully!",
        data:result
    })
})
const updateAdmin = catchAsync(async (req:Request,res:Response)=>{
    const {id} = req.params
    const result = await adminServices.updateAdmin(id,req.body);
    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:"Admin updated successfully!",
        data:result
    }) 
    
})
const deleteAdmin = catchAsync(async (req:Request,res:Response)=>{
    const {id} = req.params
    
    const result = await adminServices.deleteAdmin(id);
    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:"Admin deleted successfully!",
        data:result
    })
    
})
const softDeleteAdmin = catchAsync(async (req:Request,res:Response)=>{
    const {id} = req.params
    
    const result = await adminServices.softDeleteAdmin(id);
     sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:"Admin deleted successfully!",
        data:result
    })
   
})

export const adminController ={
    getAdmin,
    getAdminById,
    updateAdmin,
    deleteAdmin,
    softDeleteAdmin
}