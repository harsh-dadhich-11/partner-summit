import { SUMMIT_STATS } from "@/data/site";

export default function Stats() {
  return (
    <section className="border-y border-rule bg-surface-sunk">
      <div className="mx-auto max-w-[80rem] px-6 py-16 lg:py-20">
        {/*
          A plain list, not a <dl>. The figure reads above its caption, which in a
          description list is <dd> before <dt> — invalid, and no reordering trick is
          worth the markup when neither element is doing semantic work here.
        */}
        <ul className="grid grid-cols-2 gap-x-8 gap-y-12 lg:grid-cols-4 lg:gap-x-12">
          {SUMMIT_STATS.map((stat, index) => (
            <li
              key={stat.note}
              className="row-in visible text-center"
              style={{ "--i": index } as React.CSSProperties}
            >
              <span
                aria-hidden="true"
                className={`mx-auto mb-6 block h-[3px] w-20 lg:w-24 ${
                  stat.accent === "cyan" ? "bg-cyan-bright" : "bg-orange-bright"
                }`}
              />
              {/* font-display as well as tabular-nums: Poppins ships no `tnum`, so the
                  figures only align on the display face. */}
              <p className="font-display text-h1 leading-none text-teal-dark tabular-nums">
                {stat.value}
              </p>
              <p className="mx-auto mt-4 max-w-[22ch] text-small text-teal-base">{stat.note}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
