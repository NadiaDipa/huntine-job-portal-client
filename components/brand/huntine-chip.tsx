/**
 * Logo-style "HUNTine" wordmark inside a soft orange chip.
 * The chip inherits its font size from the surrounding headline, so it scales
 * with the <h1> on both auth pages without extra sizes to keep in sync.
 */
export function HuntineChip() {
  return (
    <span className="inline-flex items-baseline whitespace-nowrap rounded-lg border border-brand/60 bg-brand/5 px-5 py-1.5 mx-1 text-[0.95em] align-middle shadow-[0_0_24px_-6px_rgba(249,115,22,0.55)]">
      <span className="font-extrabold tracking-tight text-white">
        HUNT
      </span>
      <span className="text-[0.8em] font-medium tracking-tight text-brand">
        ine
      </span>
      <span
        aria-hidden="true"
        className="ml-0.5 inline-block size-[0.22em] rounded-full bg-brand"
      />
    </span>
  )
}
