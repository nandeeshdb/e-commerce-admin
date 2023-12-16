import { useParams } from "next/navigation"
import { Origin } from '../hooks/use-origin';
import { ApiAlert } from "./ui/api-alert";

interface ApiListProps{
    entityName:string
    entityId:string

}
export const ApiList:React.Fc<ApiListProps>=({
    entityName,
    entityId
})=>{

    const params= useParams()
    const origin = Origin();
    const baseUrl = `${origin}/api/${params.storeId}`
    return(
        <>
        <ApiAlert 
         title="Get"
         variant="public"
         description={`${baseUrl}/${entityName}`}
        />
        
        <ApiAlert 
         title="Get"
         variant="public"
         description={`${baseUrl}/${entityName}/{${entityId}}`}
        />
 
   <ApiAlert 
         title="Post"
         variant="admin"
         description={`${baseUrl}/${entityName}`}
        />

<ApiAlert 
         title="Delete"
         variant="admin"
         description={`${baseUrl}/${entityName}/{${entityId}}`}
        />
        
        <ApiAlert 
         title="Patch"
         variant="admin"
         description={`${baseUrl}/${entityName}/{${entityId}}`}
        />
        </>
    )
}