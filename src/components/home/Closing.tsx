/**
 * Type only. Gallery already spends a full dark band on photography, so this one closes
 * on restraint instead of reaching for a second image.
 */
export default function Closing() {
  return (
    <section className="bg-teal-dark text-cream">
      <div className="mx-auto max-w-[80rem] px-6 py-28 lg:py-40">
        <div className="max-w-[38rem]">
          <h2 className="rise visible font-display text-h1 text-cream">
            This exists because of you.
          </h2>
          <p className="fade-in visible mt-8 text-lead text-cream/70">
            Odyssey is built on relationships made over years of working together. Three days to
            slow down, look back with some gratitude, and look ahead with intent.
          </p>
          <p className="fade-in visible mt-6 font-display text-h3 text-orange-soft italic">
            We&rsquo;ll see you in Jaipur.
          </p>
        </div>
      </div>
    </section>
  );
}
