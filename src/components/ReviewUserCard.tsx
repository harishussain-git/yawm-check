import type { User } from "@/types/app";

type ReviewUserCardProps = {
  user: User;
  score: string;
};

export function ReviewUserCard({ user, score }: ReviewUserCardProps) {
  return (
    <div className="rounded-[24px] border border-zinc-800 bg-zinc-950 p-4">
      <div className="flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-full bg-emerald-500/15 text-sm font-semibold text-emerald-200">
          {user.initials}
        </div>
        <div>
          <p className="text-sm text-zinc-400">{user.name}</p>
          <p className="text-2xl font-semibold tracking-tight text-zinc-50">{score}</p>
        </div>
      </div>
    </div>
  );
}
