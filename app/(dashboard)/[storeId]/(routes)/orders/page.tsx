import React from 'react'
import OrderClient from './components/client'
import prismadb from '@/lib/prismadb';
import { OrderColumn } from './components/columns';
import {format} from "date-fns"
import { formatter } from '@/lib/utils';

async function OrdersPage({params}:{params:{storeId:string}}) {

  const orders = await prismadb.order.findMany({
    where:{
      storeId:params.storeId
    },
    include:{
      orderItems:{
        include:{
          product:true
        }
      }
    },
    orderBy:{
      createdAt:"desc"
    }
  })

  const formatedOrdersData: OrderColumn[]=orders.map((item)=>({
    id:item.id,
    phone:item.phone,
    address:item.address,
    isPaid:item.isPaid,
    products:item.orderItems.map((a)=>a.product.name).join(', '),
    totalPrice:formatter.format(item.orderItems.reduce((total,items)=>{
      return total + Number(items.product.price)
    },0)),
    createdAt:format(item.createdAt,"MMMM do, yyyy")
}))

  return (
    <div className='flex-col'>
      <div className='flex-1 space-x-4 p-8 pt-6'>
          <OrderClient data={formatedOrdersData}/>
      </div>

    </div>
  )
}

export default OrdersPage