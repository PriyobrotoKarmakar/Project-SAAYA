import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, Maximize2 } from "lucide-react";

export function MapControls({ map }) {
  if (!map) return null;

  return (
    <div className="absolute bottom-8 right-4 z-[500] flex flex-col gap-2">
      <Button
        variant="secondary"
        size="icon"
        className="h-10 w-10 shadow-lg bg-black/80 backdrop-blur text-white hover:bg-black"
        onClick={() => map.zoomIn()}
      >
        <ZoomIn className="h-5 w-5" />
      </Button>
      <Button
        variant="secondary"
        size="icon"
        className="h-10 w-10 shadow-lg bg-black/80 backdrop-blur text-white hover:bg-black"
        onClick={() => map.zoomOut()}
      >
        <ZoomOut className="h-5 w-5" />
      </Button>
      <Button
        variant="secondary"
        size="icon"
        className="h-10 w-10 shadow-lg bg-black/80 backdrop-blur text-white hover:bg-black"
        onClick={() => map.setView([28.6139, 77.209], 11)}
      >
        <Maximize2 className="h-5 w-5" />
      </Button>
    </div>
  );
}
