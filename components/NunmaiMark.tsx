/**
 * The Nunmai mark. `gap` is the colour of the outline around the inner diamond:
 * set it to the background colour the mark sits on.
 */
export function NunmaiMark({
  className = "",
  gap = "#ffffff",
  label,
}: {
  className?: string;
  gap?: string;
  label?: string;
}) {
  return (
    <svg
      viewBox="0 0 120 140"
      className={className}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <path
        fill="currentColor"
        d="M63.6 29.6c-14.4 0-26.1 11.7-26.1 26.1 0 7.8 3.7 18.3 9.4 26.8 5.4 8 11.8 13 16.7 13 3.5 0 9.9-4.1 16.2-13.1 6-8.7 9.9-19.2 9.9-26.7 0-14.4-11.7-26.1-26.1-26.1m0 85.9c-6.6 0-13.1-2.3-19.4-6.9-5.1-3.7-9.7-8.7-13.9-15-8-11.9-12.8-26.1-12.8-38 0-12.3 4.8-23.9 13.5-32.6S51.3 9.7 63.6 9.7 87.5 14.5 96.2 23s13.5 20.3 13.5 32.6c0 11.7-5 25.9-13.4 38.1-4.2 6-8.9 11.1-13.8 14.8-6.2 4.7-12.6 7-18.9 7"
      />
      <path fill={gap} d="M99.9 105.5 63.6 141.8 27.4 105.5 63.6 69.3z" />
      <path fill="currentColor" d="M89 105.5 63.6 130.9 38.3 105.5 63.6 80.2z" />
    </svg>
  );
}
