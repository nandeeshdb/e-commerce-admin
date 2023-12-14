import { userStoreModal } from "@/hooks/user-store-modal"
import { Modal } from "@/components/ui/modal"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormItem, FormLabel, FormField, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import axios from "axios"
import toast from "react-hot-toast"

const formSchema = z.object({
    name:z.string().min(1)
})



export const  StoreModel=()=>{
    const storeModal = userStoreModal()
    const [loading,setLoading] = useState(false)


    const form = useForm<z.infer<typeof formSchema>>({
        resolver:zodResolver(formSchema),
        defaultValues:{
            name:''
        }
    })


    const onSubmit=async(values:z.infer<typeof formSchema>)=>{
        try {
            setLoading(true)
           const response = await  axios.post('/api/stores',values)
           window.location.assign(`/${response.data.id}`)
            
        } catch (error) {
            toast.error("Store not created")  
        }
        finally{
            setLoading(false)
        }

    }



    return(

        <Modal
            title="Create a store"
            description="Add a new store products and categories"
            isOpen={storeModal.isOpen}
            onClose={storeModal.onClose}>


                <div>
                    <div className="space-y-4 py-2 pb-4">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)}>
                                <FormField 
                                    control={form.control}
                                    name="name"
                                    render={({field})=>(
                                        <FormItem>
                                                <FormLabel>Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="name of store" {...field} disabled={loading}/>
                                                </FormControl>
                                                <FormMessage />
                                            
                                        </FormItem>
                                    )}
                                />
                                <div className="pt-6 space-x-4 flex items-center justify-end w-full">
                                    <Button variant="outline" onClick={storeModal.onClose} disabled={loading}>Cancel</Button>
                                    <Button type="submit" disabled={loading}>Continue</Button>

                                </div>

                            </form>

                        </Form>

                    </div>
                </div>
            </Modal>
    )
}