import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"


export async function GET(
    req:Request,
    {params}:{params:{ sizeId:string}}

){
    
    try {
      
        
        if(!params.sizeId){
            return new NextResponse('Required sizeId',{status:402})
        }

      


        const size = await prismadb.size.findUnique({
            where:{
                id:params.sizeId,
                
            },
          
        })

        return  NextResponse.json(size)
        
        
    } catch (error) {
        console.log('[size_Get]',error)
        return new NextResponse('Internal Server Error',{status:500})
        
    }
}





export async function PATCH(
    req:Request,
    {params}:{params:{storeId: string, sizeId:string}}

){
    const body = await req.json();
   const  {name,value} = body;
    try {
        const{userId} = auth();
        if(!userId){
            return new NextResponse('Unauthorized',{status:400})
        }
        if(!name){
            return new NextResponse('Required name',{status:401})
        }
        if(!value){
            return new NextResponse('Required value',{status:401})
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
        

        const size = await prismadb.size.updateMany({
            where:{
                id:params.sizeId,
                
            },
            data:{
                name,value
            }
        })

        return  NextResponse.json(size)
        
        
    } catch (error) {
        console.log('[size_PATCH]',error)
        return new NextResponse('Internal Server Error',{status:500})
        
    }
}





export async function DELETE(
    req:Request,
    {params}:{params:{storeId: string, sizeId:string}}

){
    
    try {
        const{userId} = auth();
        if(!userId){
            return new NextResponse('Unauthorized',{status:400})
        }
        
        if(!params.sizeId){
            return new NextResponse('Required sizeId',{status:402})
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

        const size = await prismadb.size.deleteMany({
            where:{
                id:params.sizeId,
                
            },
          
        })

        return  NextResponse.json(size)
        
        
    } catch (error) {
        console.log('[size_delete]',error)
        return new NextResponse('Internal Server Error',{status:500})
        
    }
}