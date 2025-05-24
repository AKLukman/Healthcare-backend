import { Admin, Prisma, UserStatus } from "@prisma/client"
import { adminSearchableFields } from "./admin.constant";
import { calculatePaginations } from "../../helpers/paginationsHelpers";
import prisma from "../../shared/prisma";
import { IAdminFilterRequest } from "./admin.interface";
import { IPaginationsOptions } from "../../interfaces/paginations";


const getAdmin =async (params:IAdminFilterRequest,options:IPaginationsOptions)=>{

    const {searchTerm,...filterData} =params;
    const {limit,page,skip} =calculatePaginations(options);
    
    
  

    const andCondition: Prisma.AdminWhereInput[] =[];
    if(params.searchTerm){
        andCondition.push({
            OR:adminSearchableFields.map((field)=>({
                [field]:{

                    contains:params.searchTerm,
                    mode:"insensitive"
                    
                }
                
            }))
        })
    }

    if(Object.keys(filterData).length>0){
        andCondition.push({
            AND:Object.keys(filterData).map((key)=>({
                [key]:{
                    equals:(filterData as any)[key]
                }
            }))
        })
    }

    andCondition.push({
        isDeleted:false
    })
    const whereConditions:Prisma.AdminWhereInput = {AND: andCondition}
  
    const result = await prisma.admin.findMany({
        where:whereConditions,
        skip,
        take:limit,
        orderBy: options.sortBy && options.sortOrder?{
            [options.sortBy]:options.sortOrder
        }:{
            createdAt:"desc"
        }
    });

    const total = await prisma.admin.count({
        where: whereConditions
    })
    return {
        meta:{
            page,
            limit,
            total

        },
        data:result
    };
}

const getAdminById =async(id:string):Promise<Admin | null>=>{
     // is Eixst or not
    await prisma.admin.findUniqueOrThrow({
        where:{
            id,
            isDeleted:false
        }
    })

    const result = await prisma.admin.findUnique({
        where:{
            id
        }
    })

    return result
}
const updateAdmin =async(id:string,data:Partial<Admin>)=>{

    // is Eixst or not
    await prisma.admin.findUniqueOrThrow({
        where:{
            id,
            isDeleted:false
        }
    })
    const result = await prisma.admin.update({
        where:{
            id
        },
        data
    })

    return result
}
const deleteAdmin =async(id:string):Promise<Admin | null>=>{

    // is Eixst or not
    await prisma.admin.findUniqueOrThrow({
        where:{
            id,
            isDeleted:false
        }
    })
  
       
    const result = await prisma.$transaction(async(transctionClient)=>{
        const deletedAdmin = await transctionClient.admin.delete({
            where:{
                id
            }
        })
        const deletedUser = await transctionClient.user.delete({
            where:{
                email: deletedAdmin.email
            }
        })
        return deletedAdmin
    })

    return result
}
const softDeleteAdmin =async(id:string):Promise<Admin | null>=>{

    // is Eixst or not
    await prisma.admin.findUniqueOrThrow({
        where:{
            id,
            isDeleted:false
        }
    }) 
    const result = await prisma.$transaction(async(transctionClient)=>{
        const deletedAdmin = await transctionClient.admin.update({
            where:{
                id
            },
            data:{
                isDeleted:true
            }
        })
        const deletedUser = await transctionClient.user.update({
            where:{
                email: deletedAdmin.email
            },
            data:{
                status:UserStatus.DELETED
            }
        })
        return deletedAdmin
    })

    return result
}

export const adminServices ={
    getAdmin,
    getAdminById,
    updateAdmin,
    deleteAdmin,
    softDeleteAdmin
}