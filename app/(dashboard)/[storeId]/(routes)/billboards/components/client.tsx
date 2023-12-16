"use client"
import { Heading } from "@/components/Heading"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Billboard } from "@prisma/client"
import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { BillBoardColumn, columns } from "./columns"
import { DataTable } from "@/components/data-table"
import { ApiList } from "@/components/api-list"


interface BillBoardProps{
  data:BillBoardColumn[]
}

const BillboardClient:React.FC<BillBoardProps>=({data})=>{


    const router = useRouter()
    const params = useParams()

  return (
    <>
    <div className="flex items-center justify-between">
        <Heading 
            title={`Billboard (${data.length}) `}
            description="Manage billboard for your store"           
        />
        <Button
            onClick={()=>router.push(`/${params.storeId}/billboards/new`)}>
            <Plus className="h-4 w-4 mr-2" />
            Add new
        </Button>

    </div>
    <Separator />
    <DataTable searchKey='label' columns={columns} data={data}/>
    <Heading title="Api list" description="Api list for description" />
    <Separator />
    <ApiList entityName="billboards" entityId="billboardId"/>
    </> 
  )
}

export default BillboardClient