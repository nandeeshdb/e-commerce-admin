"use client"
import { Heading } from "@/components/Heading"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { ProductColumn, columns } from "./columns"
import { DataTable } from "@/components/data-table"
import { ApiList } from "@/components/api-list"


interface ProductProps{
  data:ProductColumn[]
}

const ProductClient:React.FC<ProductProps>=({data})=>{


    const router = useRouter()
    const params = useParams()

  return (
    <>
    <div className="flex items-center justify-between">
        <Heading 
            title={`product (${data.length}) `}
            description="Manage product for your store"           
        />
        <Button
            onClick={()=>router.push(`/${params.storeId}/products/new`)}>
            <Plus className="h-4 w-4 mr-2" />
            Add new
        </Button>

    </div>
    <Separator />
    <DataTable searchKey='label' columns={columns} data={data}/>
    <Heading title="Api list" description="Api list for description" />
    <Separator />
    <ApiList entityName="products" entityId="productId"/>
    </> 
  )
}

export default ProductClient