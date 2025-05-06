import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import NavigationSidebar from "./navigation/navigation-sidebar";
import ServerSideBar from "./server/server-sidebar";

export default function MobileToggle({ serverId }: { serverId: string }) {
  return (
    <Sheet >
      <SheetTrigger asChild>
        <Button variant="ghost" className="md:hidden" size="icon">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent className="p-0 flex gap-0 w-[307px]" side="left">
      <div className="flex p-0 h-full">
      <div>
        <NavigationSidebar />
      </div>
      <div >
        <ServerSideBar serverId={serverId} />
      </div>
      </div>
    </SheetContent>
    </Sheet>
  );
}