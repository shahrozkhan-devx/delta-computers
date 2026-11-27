export default function SectionTitle({ eyebrow, title, description, action }) {
  return (
    <div className="mb-9 flex flex-col gap-5 md:mb-12 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        <p className="mb-3 text-xs font-bold uppercase tracking-[.23em] text-cyan">{eyebrow}</p>
        <h2 className="font-display text-3xl font-semibold tracking-[-.045em] text-white sm:text-4xl">{title}</h2>
        {description && <p className="mt-3 max-w-xl text-sm leading-7 text-muted sm:text-base">{description}</p>}
      </div>
      {action}
    </div>
  );
}
