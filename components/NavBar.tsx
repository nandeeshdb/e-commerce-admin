import { UserButton, auth } from "@clerk/nextjs"
import MainNav from "@/components/main-nav"
import StoreSwitcher from "@/components/store-switcher"
import { redirect } from "next/navigation";
import prismadb from "@/lib/prismadb";


async function NavBar() {
    const {userId} = auth();
    if(!userId){
        redirect('/sign-in')
    }
    const stores = await prismadb.store.findMany({
        where:{
            userId
        }
    })


  return (
    <div className="border-b">
        <div className="flex items-center h-16 px-4">
            <div>
                <StoreSwitcher items={stores}/>
            </div>
            <div>
                <MainNav />

            </div>
            <div className="ml-auto flex items-center gap-4">
                <UserButton afterSignOutUrl="/"/>

            </div>

        </div>

    </div>
  )
}

export default NavBar