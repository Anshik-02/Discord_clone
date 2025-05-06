"use client";

import { Search } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface ServerSearchProps {
  data: {
    label: string;
    type: "channel" | "member";
    data:
      | {
          icon: React.ReactNode;
          name: string;
          id: string;
        }[]
      | undefined;
  }[];
}

export default function ServerSearch({ data }: ServerSearchProps) {
  const [open, setOpen] = useState(false);
  const router=useRouter()
  const params=useParams()
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="cursor-pointer rounded-md flex items-center gap-x-2 group px-2 py-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition"
      >
        <Search className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
        <p className="font-semibold text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-50 transition">
          Search
        </p>
      </button>
      
      <CommandDialog open={open} onOpenChange={setOpen}>
  
    <CommandInput placeholder="Search all channels or members" />
    <CommandList>
      <CommandEmpty>No Results found</CommandEmpty>
      {data.map(({ label, type, data }) => {
        if (!data?.length) return null;
        return (
          <CommandGroup key={label} heading={label}>
            {data.map(({ id, icon, name }) => (
              <CommandItem key={id}>
                {icon}
                <span>{name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        );
      })}
    </CommandList>

</CommandDialog>

    </>
  );
}
