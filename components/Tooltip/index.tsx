import * as TooltipRadix from "@radix-ui/react-tooltip";
import TooltipProps from "./tooltip.types";

const Tooltip = ({ children, content }: TooltipProps) => {
  return (
    <TooltipRadix.Provider delayDuration={10}>
      <TooltipRadix.Root>
        <TooltipRadix.Trigger>{children}</TooltipRadix.Trigger>
        <TooltipRadix.Portal>
          <TooltipRadix.Content
            className="max-w-xl rounded-md bg-white p-2 text-center shadow-xl"
            sideOffset={5}
          >
            {content}
            <TooltipRadix.Arrow className="fill-white" />
          </TooltipRadix.Content>
        </TooltipRadix.Portal>
      </TooltipRadix.Root>
    </TooltipRadix.Provider>
  );
};

export default Tooltip;
