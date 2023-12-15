import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function PATCH(
    req:Request,
    {params}:{params:{storeId: string}}

){
    const body = await req.json();
   const  {name} = body;
    try {
        const{userId} = auth();
        if(!userId){
            return new NextResponse('Unauthorized',{status:400})
        }
        if(!name){
            return new NextResponse('Required name',{status:401})
        }
        if(!params.storeId){
            return new NextResponse('Required storeId',{status:402})
        }

        const store = await prismadb.store.updateMany({
            where:{
                id:params.storeId,
                userId
            },
            data:{
                name
            }
        })

        return  NextResponse.json(store)
        
        
    } catch (error) {
        console.log('[store_PATCH]',error)
        return new NextResponse('Internal Server Error',{status:500})
        
    }
}





export async function DELETE(
    req:Request,
    {params}:{params:{storeId: string}}

){
    
    try {
        const{userId} = auth();
        if(!userId){
            return new NextResponse('Unauthorized',{status:400})
        }
        
        if(!params.storeId){
            return new NextResponse('Required storeId',{status:402})
        }

        const store = await prismadb.store.deleteMany({
            where:{
                id:params.storeId,
                userId
            },
          
        })

        return  NextResponse.json(store)
        
        
    } catch (error) {
        console.log('[store_PATCH]',error)
        return new NextResponse('Internal Server Error',{status:500})
        
    }
}