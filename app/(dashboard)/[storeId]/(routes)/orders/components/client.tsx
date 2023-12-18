"use client"
import { Heading } from "@/components/Heading"
import { Separator } from "@/components/ui/separator"
import { OrderColumn, columns } from "./columns"
import { DataTable } from "@/components/data-table"
import { ApiList } from "@/components/api-list"


interface OrderProps{
  data:OrderColumn[]
}

const OrderClient:React.FC<OrderProps>=({data})=>{
  return (
    <>
  
        <Heading 
            title={`order (${data.length}) `}
            description="Manage order for your store"           
        />
    <Separator />
    <DataTable searchKey='products' columns={columns} data={data}/>
    </> 
  )
}

export default OrderClient