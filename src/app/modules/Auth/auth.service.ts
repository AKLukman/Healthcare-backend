import { UserStatus } from "@prisma/client"
import { jwtHelpers } from "../../helpers/jwtHelpers"
import prisma from "../../shared/prisma"
import bcrypt from 'bcrypt'





const login =async(payload:{email:string,password:string})=>{
    const userData = await prisma.user.findFirstOrThrow({
        where:{
            email:payload.email,
            status:UserStatus.ACTIVE
        }
    })
    const isCorrectPassword = await bcrypt.compare(payload.password,userData.password)
    if(!isCorrectPassword){
        throw new Error("Password or email incorrect!")
    }
    const accessToken = jwtHelpers.generateToken({email:userData.email,
            role: userData.role},"shksslsibtghbhsiu",'15m') 
    const refreshToken = jwtHelpers.generateToken({email:userData.email,
            role: userData.role},"shksslsibtghbhsiu",'365d')
    
    
    return{
        accessToken,
        refreshToken,
        needPasswordChange: userData.needPasswordChange
    }
}

const refreshToken =async(token:string)=>{
    
    let decodedData;
    try {
        decodedData = jwtHelpers.verifyToken(token,"shksslsibtghbhsiu")
    } catch (error) {
        throw new Error("You are not authorized!")
    }
   const userData = await prisma.user.findUniqueOrThrow({
        where:{
            email: decodedData.email,
            status:UserStatus.ACTIVE
        }
   })

    const accessToken = jwtHelpers.generateToken({email:userData.email,
            role: userData.role},"shksslsibtghbhsiu",'15m') 
   return {
        accessToken,
        needPasswordChange: userData.needPasswordChange
   };
}

export const AuthServices ={
    login,
    refreshToken
}