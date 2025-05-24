import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import  httpStatus from "http-status";
import { AuthServices } from "./auth.service";



const login = catchAsync(async(req,res)=>{
    const result = await AuthServices.login(req.body)
    const {refreshToken} = result;

    res.cookie('refreshToken',refreshToken,{
        secure:false,
        httpOnly:true
    })

    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:"Logged in successfully!",
        data:{
            accessToken: result.accessToken,
            needPasswordChange: result.needPasswordChange
        }
    })
})
const refreshToken = catchAsync(async(req,res)=>{
    const {refreshToken} = req.cookies;
    const result = await AuthServices.refreshToken(refreshToken)
   

    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:"refresh token retrived successfully!",
        data:result
        
    })
})

export const AuthControllers ={
    login,
    refreshToken
}