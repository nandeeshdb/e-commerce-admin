"use client"
import { Heading } from "@/components/Heading"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"

function BillboardClient() {
    const router = useRouter()
    const params = useParams()

  return (
    <>
    <div className="flex items-center justify-between">
        <Heading 
            title="Billboard"
            description="Manage billboard for your store"           
        />
        <Button
            onClick={()=>router.push(`/${params.storeId}/billboards/new`)}>
            <Plus className="h-4 w-4 mr-2" />
            Add new
        </Button>

    </div>
    <Separator />
    </> 
  )
}

export default BillboardClient