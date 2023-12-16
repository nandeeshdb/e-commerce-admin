"use client"
import { Billboard, Store } from "@prisma/client"
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


interface BillBoardFormProps{
  initialData:Billboard | null
}

const formSchema = z.object({
  label:z.string().min(1),
  imageUrl:z.string().min(1)
})

type BillBoardFormValue = z.infer<typeof formSchema>

const BillBoardForm:React.FC<BillBoardFormProps>=({initialData})=>{

  const[open,setOpen] = useState(false)
  const[loading,setLoading] = useState(false)
  const params = useParams();
  const route = useRouter()
  const origin =Origin()
  const title = initialData ? 'Edit billboard' : 'Create new Billboard'
  const description = initialData ? 'Edit billboard' : 'Create new Billboard'
  const toastMessage = initialData ? 'Billboard edited' : 'Billboard created'
  const action = initialData ? 'Save changes' : 'create'

  const form = useForm<BillBoardFormValue>({
    resolver:zodResolver(formSchema),
    defaultValues:initialData || {
        label:'',
        imageUrl:''
    }
  })

  const onSubmit = async (data: BillBoardFormValue) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(`/api/${params.storeId}/billboards/${params.billboardId}`, data);
      } else {
        await axios.post(`/api/${params.storeId}/billboards`, data);
      }
      route.refresh();
      route.push(`/${params.storeId}/billboards`);
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
      await axios.delete(`/api/${params.storeId}/billboards/${params.billboardId}`);
      route.refresh();
      route.push(`/${params.storeId}/billboards`);
      toast.success('Billboard deleted.');
    } catch (error: any) {
      toast.error('Make sure you removed all categories using this billboard first.');
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

      <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Background image</FormLabel>
                  <FormControl>
                    <ImageUpload 
                      value={field.value ? [field.value] : []} 
                      disabled={loading} 
                      onChange={(url) => field.onChange(url)}
                      onRemove={() => field.onChange('')}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

        <div className="grid grid-cols-3 gap-8">

          <FormField
          control={form.control}
          name="label"
          render={({field})=>(
            <FormItem>
              <FormLabel>Bill Board</FormLabel>
              <FormControl>
              <Input placeholder="enter billboard name" disabled={loading} {...field}/>
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

export default BillBoardForm