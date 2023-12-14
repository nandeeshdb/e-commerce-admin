
import { UserButton } from "@clerk/nextjs";

export default function SetUpPage() {
  return (
    <div className="h-screen">
      <UserButton afterSignOutUrl="/"/>
    </div>
  )
}
