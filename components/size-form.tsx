"use client"
import { Billboard, Size, Store } from "@prisma/client"
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
import ImageUpload from "./image-upload"
import { url } from "inspector"


interface SizeProps{
  initialData:Size | null
}

const formSchema = z.object({
  name:z.string().min(1),
  value:z.string().min(1)
})

type SizeFormValue = z.infer<typeof formSchema>

const SizeForm:React.FC<SizeProps>=({initialData})=>{

  const[open,setOpen] = useState(false)
  const[loading,setLoading] = useState(false)
  const params = useParams();
  const route = useRouter()
  const origin =Origin()
  const title = initialData ? 'Edit Size' : 'Create new Size'
  const description = initialData ? 'Edit Size' : 'Create new Size'
  const toastMessage = initialData ? 'Size edited' : 'Size created'
  const action = initialData ? 'Save changes' : 'create'

  const form = useForm<SizeFormValue>({
    resolver:zodResolver(formSchema),
    defaultValues:initialData || {
        name:'',
        value:''
    }
  })

  const onSubmit = async (data: SizeFormValue) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(`/api/${params.storeId}/sizes/${params.sizeId}`, data);
      } else {
        await axios.post(`/api/${params.storeId}/sizes`, data);
      }
      route.refresh();
      route.push(`/${params.storeId}/sizes`);
      toast.success(toastMessage);
    } catch (error: any) {
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/sizes/${params.sizeId}`);
      route.refresh();
      route.push(`/${params.storeId}/sizes`);
      toast.success('Size deleted.');
    } catch (error: any) {
      toast.error('Make sure you removed all categories using this Size first.');
    } finally {
      setLoading(false);
      setOpen(false);
    }
  }
  return(
    <>

    <AlertModal 
    isOpen={open}
    onClose={()=>setOpen(false)}
    onConfirm={onDelete}
    loading={loading}
    />

    <div className="flex items-center justify-between p-6">
      <Heading title={title} description={description}/>
      
     {
        initialData &&(
            <Button
            disabled={loading}
            variant="destructive"
            size="icon" 
            onClick={()=>setOpen(true)}
            >
                <Trash className="h-4 w-4"/>
            </Button>
        )
     }
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
              <FormLabel>Size name</FormLabel>
              <FormControl>
              <Input placeholder="enter size name" disabled={loading} {...field}/>
              </FormControl>
              <FormMessage />
            </FormItem>
             )}
        />

          <FormField
          control={form.control}
          name="value"
          render={({field})=>(
            <FormItem>
              <FormLabel>Size value</FormLabel>
              <FormControl>
              <Input placeholder="enter size value" disabled={loading} {...field}/>
              </FormControl>
              <FormMessage />
            </FormItem>
             )}
        />
        </div>
        <Button
        disabled={loading}
        type="submit"
        >{action}</Button>

      </form>
    </Form>
    </>
  )
}

export default SizeForm