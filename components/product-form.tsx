"use client"

import { Heading } from "./Heading"
import { Button } from "./ui/button"
import { Router, Trash } from "lucide-react"
import { Separator } from "./ui/separator"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { Input } from "./ui/input"
import axios from "axios"
import toast from "react-hot-toast"
import { redirect, useParams,useRouter } from "next/navigation"
import { AlertModal } from "./modals/alert-modal"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

import { Origin } from "@/hooks/use-origin"
import ImageUpload from "./image-upload"
import { url } from "inspector"
import { Image, Product,Category,Size, Color } from "@prisma/client"
import { userStoreModal } from '../hooks/user-store-modal';
import { Checkbox } from "./ui/checkbox"


interface ProductProps{
  initialData:Product & {
    images:Image[]
  } | null;

  categories:Category[]
  sizes:Size[]
  colors:Color[]
}

const formSchema = z.object({
  name:z.string().min(1),
  images:z.object({url:z.string()}).array(),
  price:z.coerce.number().min(1),
  colorId:z.string().min(1),
  sizeId:z.string().min(1),
  categoryId:z.string().min(1),
  isFeatured:z.boolean().default(false).optional(),
  isArchived:z.boolean().default(false).optional(),
})

type ProductFormValue = z.infer<typeof formSchema>

const ProductForm:React.FC<ProductProps>=({initialData,categories,colors,sizes})=>{

  const[open,setOpen] = useState(false)
  const[loading,setLoading] = useState(false)
  const params = useParams();
  const route = useRouter()
  const origin =Origin()
  const title = initialData ? 'Edit Product' : 'Create new Product'
  const description = initialData ? 'Edit Product' : 'Create new Product'
  const toastMessage = initialData ? 'Product edited' : 'Product created'
  const action = initialData ? 'Save changes' : 'create'

  const form = useForm<ProductFormValue>({
    resolver:zodResolver(formSchema),
    defaultValues:initialData ? {...initialData,
        price:parseFloat(String(initialData?.price))
    } :{
        name:'',
        images:[],
        price:0,
        colorId:'',
        sizeId:'',
        categoryId:'',
        isFeatured:false,
        isArchived:false
    }
  })

  const onSubmit = async (data: ProductFormValue) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(`/api/${params.storeId}/products/${params.productId}`, data);
      } else {
        await axios.post(`/api/${params.storeId}/products`, data);
      }
      route.refresh();
      route.push(`/${params.storeId}/products`);
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
      await axios.delete(`/api/${params.storeId}/products/${params.productId}`);
      route.refresh();
      route.push(`/${params.storeId}/products`);
      toast.success('product deleted.');
    } catch (error: any) {
      toast.error('Make sure you removed all categories using this product first.');
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
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <ImageUpload 
                      value={field.value.map((image)=>(image.url))} 
                      disabled={loading} 
                      onChange={(url) => field.onChange([...field.value, { url }])}
                      onRemove={(url) => field.onChange([...field.value.filter((current) => current.url !== url)])}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

        <div className="grid grid-cols-3 gap-8">

          <FormField
          control={form.control}
          name="name"
          render={({field})=>(
            <FormItem>
              <FormLabel>Product</FormLabel>
              <FormControl>
              <Input placeholder="enter product name" disabled={loading} {...field}/>
              </FormControl>
              <FormMessage />
            </FormItem>
             )}
        />

          <FormField
          control={form.control}
          name="price"
          render={({field})=>(
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
              <Input type="number" placeholder="enter price name" disabled={loading} {...field}/>
              </FormControl>
              <FormMessage />
            </FormItem>
             )}
        />



<FormField
          control={form.control}
          name="categoryId"
          render={({field})=>(
            <FormItem>
              <FormLabel>Category</FormLabel>
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
                            placeholder="select a category"
                        />
                    </SelectTrigger>
                </FormControl>
                <SelectContent>
                    {
                        categories.map((cat)=>(
                            <SelectItem
                            key={cat.id}
                            value={cat.id}
                            >
                                {cat.name}
                            </SelectItem>
                        ))
                    }
                </SelectContent>
              </Select>
            </FormItem>

             )}
        />



<FormField
          control={form.control}
          name="sizeId"
          render={({field})=>(
            <FormItem>
              <FormLabel>Size</FormLabel>
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
                            placeholder="select a size"
                        />
                    </SelectTrigger>
                </FormControl>
                <SelectContent>
                    {
                        sizes.map((size)=>(
                            <SelectItem
                            key={size.id}
                            value={size.id}
                            >
                                {size.name}
                            </SelectItem>
                        ))
                    }
                </SelectContent>
              </Select>
            </FormItem>

             )}
        />


<FormField
          control={form.control}
          name="colorId"
          render={({field})=>(
            <FormItem>
              <FormLabel>Color</FormLabel>
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
                            placeholder="select a color"
                        />
                    </SelectTrigger>
                </FormControl>
                <SelectContent>
                    {
                        colors.map((col)=>(
                            <SelectItem
                            key={col.id}
                            value={col.id}
                            >
                                {col.name}
                            </SelectItem>
                        ))
                    }
                </SelectContent>
              </Select>
            </FormItem>

             )}
        />


    <FormField
          control={form.control}
          name="isFeatured"
          render={({field})=>(
            <FormItem className="flex flex-row items-center space-x-2 space-y-0 rounded-lg border border-slate-300 p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
              <FormLabel>Featured</FormLabel>
              <FormDescription>This product will be appeared in the homepage</FormDescription>
              </div>
            </FormItem>
             )}
        />

    <FormField
          control={form.control}
          name="isArchived"
          render={({field})=>(
            <FormItem className="flex flex-row items-center space-x-2 space-y-0 rounded-lg border border-slate-400 p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
              <FormLabel>Archive</FormLabel>
              <FormDescription>This product will not appear anywhere</FormDescription>
              </div>
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

export default ProductForm