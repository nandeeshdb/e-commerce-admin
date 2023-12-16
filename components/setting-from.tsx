"use client"
import { Store } from "@prisma/client"
import { Heading } from "./Heading"
import { Button } from "./ui/button"
import { Router, Trash } from "lucide-react"
import { Separator } from "./ui/separator"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { Input } from "./ui/input"
import axios from "axios"
import toast from "react-hot-toast"
import { redirect, useParams,useRouter } from "next/navigation"
import { AlertModal } from "./modals/alert-modal"
import { ApiAlert } from "./ui/api-alert"
import { Origin } from "@/hooks/use-origin"


interface SettingFormProps{
  initialData:Store
}

const formSchema = z.object({
  name:z.string().min(1)
})

type SettingFormValue = z.infer<typeof formSchema>

const SettingForm:React.FC<SettingFormProps>=({initialData})=>{

  const[open,setOpen] = useState(false)
  const[loading,setLoading] = useState(false)
  const params = useParams();
  const route = useRouter()
  const origin =Origin()

  const form = useForm<SettingFormValue>({
    resolver:zodResolver(formSchema),
    defaultValues:initialData
  })

  const onSubmit = async(data:SettingFormValue)=>{
    try {
      setLoading(true)
      await axios.patch(`/api/stores/${params.storeId}`,data)
      route.refresh();
      toast.success('Updated successfully')

      
    } catch (error) {
      toast.error('Something went wrong')
      
    }
    finally{
      setLoading(false)

    }
  }

  const DeleteStore = async()=>{
    try {
      setLoading(true)
      axios.delete(`/api/stores/${params.storeId}`)
      route.refresh()
      route.push('/')
      toast.success("store deleted succesfully")
      

    } catch (error) {
        toast.error("1st delete all your product and categories")
    }

    finally{
      setLoading(false)
      setOpen(false)
    }

  }
  return(
    <>

    <AlertModal 
    isOpen={open}
    onClose={()=>setOpen(false)}
    onConfirm={DeleteStore}
    loading={loading}
    />

    <div className="flex items-center justify-between p-6">
      <Heading title="setting" description="setting description"/>
      <Button
            disabled={loading}
            variant="destructive"
            size="icon" 
            onClick={()=>setOpen(true)}
            >
                <Trash className="h-4 w-4"/>
            </Button>
    </div>
    <Separator />
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full p-6">
        <div className="grid grid-cols-3 gap-8">
          <FormField

          control={form.control}
          name="name"
          render={({field})=>(
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
              <Input placeholder="enter store name" disabled={loading} {...field}/>
              </FormControl>
              <FormMessage />
            </FormItem>
             )}
        />
        </div>
        <Button
        disabled={loading}
        type="submit"
        >Save Changes</Button>

      </form>
    </Form>
    <ApiAlert title="test" description={`${origin}/api/${params.storeId}`} variant="public"/>
    </>
  )
}

export default SettingForm