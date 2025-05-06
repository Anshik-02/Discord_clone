"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";


interface ActionTooltipProps {
  children?: React.ReactNode;
  label: string;
  side?: "right" | "left" | "top" | "bottom";
  align?: "start" | "center" | "end";
}

export const ActionTooltip = ({
  children,
  label,
  side = "right",
  align = "center",
}: ActionTooltipProps) => {
  return (
    <TooltipProvider delayDuration={50}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
  side={side}
  align={align}
  className="!bg-zinc-900 text-white px-3 py-2 rounded-md shadow-md border border-zinc-700 "
>

  <p className="capitalize font-semibold">{label}</p>
</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
