"use client"
import { Heading } from "@/components/Heading"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { CategoryColumn, columns } from "./columns"
import { DataTable } from "@/components/data-table"
import { ApiList } from "@/components/api-list"


interface CategoryProps{
  data:CategoryColumn[]
}

const CategoryClient:React.FC<CategoryProps>=({data})=>{


    const router = useRouter()
    const params = useParams()

  return (
    <>
    <div className="flex items-center justify-between">
        <Heading 
            title={`Category (${data.length}) `}
            description="Manage category for your store"           
        />
        <Button
            onClick={()=>router.push(`/${params.storeId}/categories/new`)}>
            <Plus className="h-4 w-4 mr-2" />
            Add new
        </Button>

    </div>
    <Separator />
    <DataTable searchKey='name' columns={columns} data={data}/>
    <Heading title="Api list" description="Api list for description" />
    <Separator />
    <ApiList entityName="category" entityId="categoryId"/>
    </> 
  )
}

export default CategoryClient