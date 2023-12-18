"use client"
import { Billboard, Category, Store } from "@prisma/client"
import { Heading } from "./Heading"
import { Button } from "./ui/button"
import {Trash } from "lucide-react"
import { Separator } from "./ui/separator"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { Input } from "./ui/input"
import axios from "axios"
import toast from "react-hot-toast"
import { useParams,useRouter } from "next/navigation"
import { AlertModal } from "./modals/alert-modal"
import { Origin } from "@/hooks/use-origin"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"



interface CategoryFormProps{
  initialData:Category | null
  billboards : Billboard[]
}

const formSchema = z.object({
  name:z.string().min(1),
  billboardId:z.string().min(1)
})

type CategoryFormValue = z.infer<typeof formSchema>

const CategoryForm:React.FC<CategoryFormProps>=({initialData,billboards})=>{

  const[open,setOpen] = useState(false)
  const[loading,setLoading] = useState(false)
  const params = useParams();
  const route = useRouter()
  const origin =Origin()
  const title = initialData ? 'Edit Category' : 'Create new Category'
  const description = initialData ? 'Edit Category' : 'Create new Category'
  const toastMessage = initialData ? 'Category edited' : 'Category created'
  const action = initialData ? 'Save changes' : 'create'

  const form = useForm<CategoryFormValue>({
    resolver:zodResolver(formSchema),
    defaultValues:initialData || {
        name:'',
        billboardId:''
    }
  })

  const onSubmit = async (data: CategoryFormValue) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(`/api/${params.storeId}/categories/${params.categoryId}`, data);
      } else {
        await axios.post(`/api/${params.storeId}/categories`, data);
      }
      route.refresh();
      route.push(`/${params.storeId}/categories`);
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
      await axios.delete(`/api/${params.storeId}/categories/${params.categoryId}`);
      route.refresh();
      route.push(`/${params.storeId}/categories`);
      toast.success('Category deleted.');
    } catch (error: any) {
      toast.error('Make sure you removed all categories using this Category first.');
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
              <FormLabel>Category name</FormLabel>
              <FormControl>
              <Input placeholder="enter category name" disabled={loading} {...field}/>
              </FormControl>
              <FormMessage />
            </FormItem>
             )}
        />

          <FormField
          control={form.control}
          name="billboardId"
          render={({field})=>(
            <FormItem>
              <FormLabel>Bill Board</FormLabel>
              <Select
              disabled={loading}
              onValueChange={field.onChange}
              value={field.value}
              defaultValue={field.value}
              >

                <FormControl>
                    <SelectTrigger>
                        <SelectValue 
                            defaultValue={field.value}
                            placeholder="select a billboard"
                        />
                    </SelectTrigger>
                </FormControl>
                <SelectContent>
                    {
                        billboards.map(bill=>(
                            <SelectItem
                            key={bill.id}
                            value={bill.id}
                            >
                                {bill.label}
                            </SelectItem>
                        ))
                    }
                </SelectContent>
              </Select>
              
              
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

export default CategoryForm