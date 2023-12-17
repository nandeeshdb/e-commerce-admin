"use client"
import { Heading } from "@/components/Heading"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import {  SizeColumns, columns } from "./columns"
import { DataTable } from "@/components/data-table"
import { ApiList } from "@/components/api-list"


interface SizeProps{
  data:SizeColumns[]
}

const SizeClient:React.FC<SizeProps>=({data})=>{


    const router = useRouter()
    const params = useParams()

  return (
    <>
    <div className="flex items-center justify-between">
        <Heading 
            title={`Sizes (${data.length}) `}
            description="Manage sizes for your store"           
        />
        <Button
            onClick={()=>router.push(`/${params.storeId}/sizes/new`)}>
            <Plus className="h-4 w-4 mr-2" />
            Add new
        </Button>

    </div>
    <Separator />
    <DataTable searchKey='label' columns={columns} data={data}/>
    <Heading title="Api list" description="Api list for description" />
    <Separator />
    <ApiList entityName="sizes" entityId="sizes"/>
    </> 
  )
}

export default SizeClient