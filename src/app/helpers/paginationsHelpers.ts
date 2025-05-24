type IOptions={
    page?:number,
    limit?:number,
    sortOrder?:string,
    sortBy?:String
}
type IOptionsResult={
    page:number,
    limit:number,
    skip:number,
    sortOrder:string,
    sortBy:String
}

export const calculatePaginations =(options:IOptions):IOptionsResult=>{
    const page:number = Number(options.page) || 1;
    const limit:number = Number(options.limit) || 10;
    const skip:number =(page-1) * limit;

    const sortBy = options.sortBy || "createdAt"
    const sortOrder:string = options.sortOrder || "desc"

    return{
        page,
        limit,
        skip,
        sortBy,
        sortOrder
    }
}