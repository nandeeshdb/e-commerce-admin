import React from 'react'
import SizeClient from './components/client'
import prismadb from '@/lib/prismadb';
import { SizeColumns } from './components/columns';
import {format} from "date-fns"

async function SizesPage({params}:{params:{storeId:string}}) {

  const sizes = await prismadb.size.findMany({
    where:{
      storeId:params.storeId
    },
    orderBy:{
      createdAt:"desc"
    }
  })

  const formatedSizesData: SizeColumns[]=sizes.map((item)=>({
    id:item.id,
    name:item.name,
    value:item.value,
    createdAt:format(item.createdAt,"MMMM do, yyyy")
}))

  return (
    <div className='flex-col'>
      <div className='flex-1 space-x-4 p-8 pt-6'>
          <SizeClient data={formatedSizesData}/>
      </div>

    </div>
  )
}

export default SizesPage