import { currentProfile } from "@/lib/current-profile"
import { useParams } from "next/navigation"


export default async function Membernames() {
 
 const profile=await currentProfile()
const params=useParams()

    return (
    <div>Membernames</div>
  )
}
