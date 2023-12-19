import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server";

export  async function POST(
    req:Request,
    {params}:{params:{storeId:string}}
    ){
    try {
        const{userId} = auth();
        const body = await req.json()
        const {name,billboardId} = body
        
        if(!userId){
            return new NextResponse("unatuenticated",{status:401})
        }
        if(!name){
            return new NextResponse("name is required",{status:400})
        }
        if(!billboardId){
            return new NextResponse("billboardId is required",{status:400})
        }
        if(!params.storeId){
            return new NextResponse("storeid is required",{status:400})
        }

        const storeByUserId = await prismadb.store.findFirst({
            where:{
                id:params.storeId,
                userId
            }
        })

        if(!storeByUserId){
            return new NextResponse("unauthorized",{status:400})
        }
        

        const category = await prismadb.category.create({
            data:{
                name,
                billboardId,
                storeId:params.storeId
            }
        })

        return NextResponse.json(category)
        
    } catch (error) {
        console.log('[category_api]',error)
        return new NextResponse("Internal server error",{status:500})
        
    }
    
}





export  async function GET(
    req:Request,
    {params}:{params:{storeId:string}}
    ){
    try {
     
        if(!params.storeId){
            return new NextResponse("storeid is required",{status:400})
        }
        

        const category = await prismadb.category.findMany({
         where:{
            storeId:params.storeId
         }
        })

        return NextResponse.json(category)
        
    } catch (error) {
        console.log('[category_get]',error)
        return new NextResponse("Internal server error",{status:500})
        
    }
    
}