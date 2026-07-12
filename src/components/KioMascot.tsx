import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { KioMascotStage } from "@/components/mascots/KioMascotStage";
import { PerryMascotStage } from "@/components/mascots/PerryMascotStage";
import { MascotSelection } from "@/components/mascots/shared";

export function KioMascot() {
  const [selection, setSelection] = useState<MascotSelection>("kio");

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 border-b border-border/70 pb-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="folio-tag">Interactive Mascot</p>
        </div>
        <div className="w-full sm:w-[13rem]">
          <Select value={selection} onValueChange={(value) => setSelection(value as MascotSelection)}>
            <SelectTrigger className="h-11 rounded-none border-border/80 bg-card/70 font-mono text-[0.72rem] uppercase tracking-[0.22em]">
              <SelectValue placeholder="Choose mascot" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="kio">Kio</SelectItem>
              <SelectItem value="perry">Perry</SelectItem>
              <SelectItem value="all">All</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className={`grid gap-4 ${selection === "all" ? "md:grid-cols-2" : ""}`}>
        {selection === "kio" && <KioMascotStage />}
        {selection === "perry" && <PerryMascotStage />}
        {selection === "all" && (
          <>
            <KioMascotStage />
            <PerryMascotStage />
          </>
        )}
      </div>
    </div>
  );
}
