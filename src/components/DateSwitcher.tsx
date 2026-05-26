import { ChevronLeft, ChevronRight } from "lucide-react";

type DateSwitcherProps = {
  label: string;
};

export function DateSwitcher({ label }: DateSwitcherProps) {
  return (
    <div className="flex items-center justify-between rounded-[24px] border border-zinc-800 bg-zinc-950 p-2">
      <button className="grid h-11 w-11 place-items-center rounded-full bg-zinc-900 text-zinc-300" type="button">
        <ChevronLeft className="h-5 w-5" aria-hidden="true" />
        <span className="sr-only">Previous</span>
      </button>
      <p className="text-sm font-semibold text-zinc-100">{label}</p>
      <button className="grid h-11 w-11 place-items-center rounded-full bg-zinc-900 text-zinc-300" type="button">
        <ChevronRight className="h-5 w-5" aria-hidden="true" />
        <span className="sr-only">Next</span>
      </button>
    </div>
  );
}
