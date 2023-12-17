"use client"
import { Heading } from "@/components/Heading"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import {  ColorColumns, columns } from "./columns"
import { DataTable } from "@/components/data-table"
import { ApiList } from "@/components/api-list"


interface ColorProps{
  data:ColorColumns[]
}

const ColorsClient:React.FC<ColorProps>=({data})=>{


    const router = useRouter()
    const params = useParams()

  return (
    <>
    <div className="flex items-center justify-between">
        <Heading 
            title={`colors (${data.length}) `}
            description="Manage colors for your store"           
        />
        <Button
            onClick={()=>router.push(`/${params.storeId}/colors/new`)}>
            <Plus className="h-4 w-4 mr-2" />
            Add new
        </Button>

    </div>
    <Separator />
    <DataTable searchKey='name' columns={columns} data={data}/>
    <Heading title="Api list" description="Api list for description" />
    <Separator />
    <ApiList entityName="Colors" entityId="Colors"/>
    </> 
  )
}

export default ColorsClient