// import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ReactNode } from "react";

interface TooltipDemoProps {
  text: ReactNode;
  notify: string;
}

export function TooltipDemo({ text, notify }: TooltipDemoProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button>{text}</button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{notify}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
