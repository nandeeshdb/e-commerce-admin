"use client"
import { userStoreModal } from "@/hooks/user-store-modal"
import { Store } from "@prisma/client"
import { PopoverTrigger } from "@radix-ui/react-popover"
import { useParams,useRouter } from "next/navigation"
import { useState } from "react"
import { Popover, PopoverContent } from "./ui/popover"
import { ChevronDown, StoreIcon,Check, PlusCircle } from "lucide-react"
import { Button } from "./ui/button"
import { cn } from "@/lib/utils"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "./ui/command"


type PopoverTriggerPops =  React.ComponentPropsWithRef <typeof PopoverTrigger>

interface StoreSwitcherProps extends PopoverTriggerPops{
    items:Store[]
}

function StoreSwitcher({className,items=[]}:StoreSwitcherProps) {
    const storeModal = userStoreModal();
    const params = useParams();
    const router = useRouter()

    const formatedItems = items.map((item)=>(
        {label:item.name,
        value:item.id}
    ))


    const currentStore = formatedItems.find((item)=>item.value === params.storeId)

    const[open,setOpen] = useState(false)

    const storeSwitcher = (store:{value:string,label:string})=>{
        setOpen(false)
        router.push(`/${store.value}`)

    }


  return (
    <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
            <Button
            variant="outline"
            size="sm"
            role="combobox"
            aria-expanded={open}
            aria-label="select a store"
            className={cn("w-[200px] justify-between",className)}
            
            >
                <StoreIcon className="mr-2 h-4 w-4"/>
                {currentStore?.label}
                <ChevronDown className="ml-auto w-4 h-4 shrink-0 opacity-50"/>
            </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
            <Command>
                <CommandList>
                    <CommandInput placeholder="search store"/>
                
                <CommandEmpty>No stores found</CommandEmpty>
                <CommandGroup heading="Stores">
                    {formatedItems.map((store)=>(
                        <CommandItem
                        onSelect={()=>storeSwitcher(store)}
                        className="text-sm"
                        >
                            <StoreIcon className="mr-2 h-4 w-4"/>
                            {store.label}
                            <Check
                            className={cn("ml-auto h-4 w-4",
                            currentStore?.value === store.value ? "opacity-100" : "opacity-0"
                            )}
                            
                            />
                        </CommandItem>
                    ))}
                    
                </CommandGroup>
                </CommandList>

                <CommandSeparator />
                <CommandList>
                    <CommandGroup>
                        <CommandItem
                            onSelect={()=>{
                                setOpen(false)
                                storeModal.onOpen()
                            }}
                        >
                            <PlusCircle className="mr-2 h-5 w-5"/>
                            Crete Store
                        </CommandItem>
                    </CommandGroup>
                </CommandList>

            </Command>
        </PopoverContent>
    </Popover>
  )
}

export default StoreSwitcher