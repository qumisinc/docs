export const MarkdownExportButton = ({ href, children, title }) => {
  // If no href provided, use current page + .md
  const targetUrl = href || (typeof window !== 'undefined' ? `${window.location.pathname}.md` : '');

  // If relative URL, make it absolute
  const fullUrl = targetUrl.startsWith('/') && typeof window !== 'undefined'
    ? `${window.location.origin}${targetUrl}`
    : targetUrl;

  // Default title if not provided
  const buttonTitle = title || `Export this page as Markdown`;

  return (
    <a
      href={fullUrl}
      className="inline-flex items-center gap-2 text-sm font-medium text-white dark:text-zinc-950 bg-zinc-900 hover:bg-zinc-700 dark:bg-zinc-100 hover:dark:bg-zinc-300 rounded-full px-3.5 py-1.5 transition-colors duration-200 not-prose"
      title={buttonTitle}
      target="_blank"
      rel="noopener noreferrer"
    >
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
        />
      </svg>
      {children || "Export as Markdown"}
    </a>
  );
};