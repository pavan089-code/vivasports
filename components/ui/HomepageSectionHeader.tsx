import { ArrowRight } from "lucide-react";

import Button from "@/components/ui/Button";

type HomepageSectionHeaderProps = {
  action?: string;
  description: string;
  eyebrow: string;
  headingId: string;
  href?: string;
  title: string;
};

export default function HomepageSectionHeader({
  action,
  description,
  eyebrow,
  headingId,
  href,
  title,
}: HomepageSectionHeaderProps) {
  return (
    <header className="mb-8 md:mb-10">
      <p className="text-xs font-black tracking-[0.2em] text-[#d4af37] uppercase">
        {eyebrow}
      </p>

      <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <h2
          className="max-w-4xl text-3xl leading-none font-black tracking-[-0.03em] text-white uppercase md:text-5xl"
          id={headingId}
        >
          {title}
        </h2>

        {action && href && (
          <Button
            className="inline-flex min-h-11 w-fit shrink-0 items-center gap-2 rounded-full px-5 py-2.5"
            href={href}
            variant="outline"
          >
            {action}
            <ArrowRight aria-hidden="true" className="size-4" />
          </Button>
        )}
      </div>

      <p className="mt-4 max-w-3xl text-base leading-7 text-slate-400">
        {description}
      </p>
    </header>
  );
}
