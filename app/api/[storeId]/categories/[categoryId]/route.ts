import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"


export async function GET(
    req:Request,
    {params}:{params:{ categoryId:string}}

){
    
    try {
      
        
        if(!params.categoryId){
            return new NextResponse('Required billboardId',{status:402})
        }

      


        const category = await prismadb.category.findUnique({
            where:{
                id:params.categoryId,
                
            },
          
        })

        return  NextResponse.json(category)
        
        
    } catch (error) {
        console.log('[category_Get]',error)
        return new NextResponse('Internal Server Error',{status:500})
        
    }
}





export async function PATCH(
    req:Request,
    {params}:{params:{storeId: string, categoryId:string}}

){
    const body = await req.json();
   const  {name,billboardId} = body;
    try {
        const{userId} = auth();
        if(!userId){
            return new NextResponse('Unauthorized',{status:400})
        }
        if(!name){
            return new NextResponse('Required label',{status:401})
        }
        if(!billboardId){
            return new NextResponse('Required imageUrl',{status:401})
        }
        if(!params.storeId){
            return new NextResponse('Required storeId',{status:402})
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
        

        const category = await prismadb.category.updateMany({
            where:{
                id:params.categoryId,
                
            },
            data:{
                name,billboardId
            }
        })

        return  NextResponse.json(category)
        
        
    } catch (error) {
        console.log('[Billboard_PATCH]',error)
        return new NextResponse('Internal Server Error',{status:500})
        
    }
}





export async function DELETE(
    req:Request,
    {params}:{params:{storeId: string, categoryId:string}}

){
    
    try {
        const{userId} = auth();
        if(!userId){
            return new NextResponse('Unauthorized',{status:400})
        }
        
        if(!params.categoryId){
            return new NextResponse('Required categoryId',{status:402})
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

        const category = await prismadb.category.deleteMany({
            where:{
                id:params.categoryId,
                
            },
          
        })

        return  NextResponse.json(category)
        
        
    } catch (error) {
        console.log('[category_delete]',error)
        return new NextResponse('Internal Server Error',{status:500})
        
    }
}