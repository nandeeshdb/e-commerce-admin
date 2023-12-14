import { userStoreModal } from "@/hooks/user-store-modal"
import { Modal } from "@/components/ui/modal"

export const  StoreModel=()=>{
    const storeModal = userStoreModal()

    return(

        <Modal
            title="Create a store"
            description="Add a new store products and categories"
            isOpen={storeModal.isOpen}
            onClose={storeModal.onClose}
        >Future create store form</Modal>
    )
}