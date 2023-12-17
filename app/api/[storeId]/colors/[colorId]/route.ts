import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"


export async function GET(
    req:Request,
    {params}:{params:{ colorId:string}}

){
    
    try {
      
        
        if(!params.colorId){
            return new NextResponse('Required colorId',{status:402})
        }

      


        const color = await prismadb.color.findUnique({
            where:{
                id:params.colorId,
                
            },
          
        })

        return  NextResponse.json(color)
        
        
    } catch (error) {
        console.log('[color_Get]',error)
        return new NextResponse('Internal Server Error',{status:500})
        
    }
}





export async function PATCH(
    req:Request,
    {params}:{params:{storeId: string, colorId:string}}

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
        

        const color = await prismadb.color.updateMany({
            where:{
                id:params.colorId,
                
            },
            data:{
                name,value
            }
        })

        return  NextResponse.json(color)
        
        
    } catch (error) {
        console.log('[color_PATCH]',error)
        return new NextResponse('Internal Server Error',{status:500})
        
    }
}





export async function DELETE(
    req:Request,
    {params}:{params:{storeId: string, colorId:string}}

){
    
    try {
        const{userId} = auth();
        if(!userId){
            return new NextResponse('Unauthorized',{status:400})
        }
        
        if(!params.colorId){
            return new NextResponse('Required colorId',{status:402})
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

        const color = await prismadb.color.deleteMany({
            where:{
                id:params.colorId,
                
            },
          
        })

        return  NextResponse.json(color)
        
        
    } catch (error) {
        console.log('[color_delete]',error)
        return new NextResponse('Internal Server Error',{status:500})
        
    }
}