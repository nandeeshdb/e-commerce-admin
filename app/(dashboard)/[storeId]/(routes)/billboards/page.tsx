import React from 'react'
import BillboardClient from './components/client'
import prismadb from '@/lib/prismadb';
import { BillBoardColumn } from './components/columns';
import {format} from "date-fns"

async function BillboardsPage({params}:{params:{storeId:string}}) {

  const billboards = await prismadb.billboard.findMany({
    where:{
      storeId:params.storeId
    },
    orderBy:{
      createdAt:"desc"
    }
  })

  const formatedBillBoardData: BillBoardColumn[]=billboards.map((item)=>({
    id:item.id,
    label:item.label,
    createdAt:format(item.createdAt,"MMMM do, yyyy")
}))

  return (
    <div className='flex-col'>
      <div className='flex-1 space-x-4 p-8 pt-6'>
          <BillboardClient data={formatedBillBoardData}/>
      </div>

    </div>
  )
}

export default BillboardsPage