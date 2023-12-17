"use client"
import { Color } from "@prisma/client"
import { Heading } from "./Heading"
import { Button } from "./ui/button"
import { Trash } from "lucide-react"
import { Separator } from "./ui/separator"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { Input } from "./ui/input"
import axios from "axios"
import toast from "react-hot-toast"

import { AlertModal } from "./modals/alert-modal"

import { Origin } from "@/hooks/use-origin"
import { redirect, useParams,useRouter } from "next/navigation"


interface colorProps{
  initialData:Color | null
}

const formSchema = z.object({
  name:z.string().min(1),
  value:z.string().min(1)
})

type ColorFormValue = z.infer<typeof formSchema>

const ColorForm:React.FC<colorProps>=({initialData})=>{

  const[open,setOpen] = useState(false)
  const[loading,setLoading] = useState(false)
  const params = useParams();
  const route = useRouter()
  
  const title = initialData ? 'Edit color' : 'Create new color'
  const description = initialData ? 'Edit color' : 'Create new color'
  const toastMessage = initialData ? 'color edited' : 'color created'
  const action = initialData ? 'Save changes' : 'create'

  const form = useForm<ColorFormValue>({
    resolver:zodResolver(formSchema),
    defaultValues:initialData || {
        name:'',
        value:''
    }
  })

  const onSubmit = async (data: ColorFormValue) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(`/api/${params.storeId}/colors/${params.colorId}`, data);
      } else {
        await axios.post(`/api/${params.storeId}/colors`, data);
      }
      route.refresh();
      route.push(`/${params.storeId}/colors`);
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
      await axios.delete(`/api/${params.storeId}/colors/${params.colorId}`);
      route.refresh();
      route.push(`/${params.storeId}/colors`);
      toast.success('color deleted.');
    } catch (error: any) {
      toast.error('Make sure you removed all categories using this color first.');
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
            color="icon" 
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
              <FormLabel>color name</FormLabel>
              <FormControl>
              <Input placeholder="enter color name" disabled={loading} {...field}/>
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
              <FormLabel>color value</FormLabel>
              <FormControl>
              <Input placeholder="enter color value" disabled={loading} {...field}/>
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

export default ColorForm