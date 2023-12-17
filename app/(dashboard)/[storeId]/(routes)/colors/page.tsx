import React from 'react'
import ColorsClient from './components/client';
import prismadb from '@/lib/prismadb';
import { ColorColumns } from './components/columns';  
import {format} from "date-fns"

async function ColorsPage({params}:{params:{storeId:string}}) {

  const colors = await prismadb.color.findMany({
    where:{
      storeId:params.storeId
    },
    orderBy:{
      createdAt:"desc"
    }
  })

  const formatedcolorsData: ColorColumns[]=colors.map((item)=>({
    id:item.id,
    name:item.name,
    value:item.value,
    createdAt:format(item.createdAt,"MMMM do, yyyy")
}))

  return (
    <div className='flex-col'>
      <div className='flex-1 space-x-4 p-8 pt-6'>
          <ColorsClient data={formatedcolorsData}/>
      </div>

    </div>
  )
}

export default ColorsPage