"use client"

import { userStoreModal } from "@/hooks/user-store-modal";
import { useEffect } from "react";

export default function SetUpPage() {
  const onOpen = userStoreModal((state)=>state.onOpen)
  const isOpen = userStoreModal((state)=>state.isOpen)

  useEffect(()=>{
    if(!isOpen){
      onOpen()
    }
  },[onOpen,isOpen])
  return null
}
