import type { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

/* ============================================================
   Markdown Configuration
   
   Centralized config for react-markdown rendering pipeline.
   Used by ContentRenderer to render AI-generated course content.
   
   Pipeline:
   1. remark-gfm: GitHub Flavored Markdown (tables, checklists, etc.)
   2. remark-math: Detect LaTeX math syntax ($...$ and $$...$$)
   3. rehype-katex: Render detected math with KaTeX
   
   Custom components are defined here so they can reference
   our design system components (CodeBlock, MathBlock, etc.)
   ============================================================ */

/** Remark plugins for the markdown processing pipeline */
export const remarkPlugins = [remarkGfm, remarkMath];

/** Rehype plugins for HTML post-processing */
export const rehypePlugins = [rehypeKatex];

/**
 * Custom component overrides for react-markdown.
 * These map HTML elements to our styled components.
 * 
 * CodeBlock and MathBlock are handled separately by ContentRenderer
 * since they require more complex rendering (Shiki, KaTeX).
 * 
 * These overrides handle inline elements within text content.
 */
export const markdownComponents: Partial<Components> = {
  /* Style inline code with monospace font and subtle background */
  code: ({ children, className, ...props }) => {
    /* If className contains "language-", it's a fenced code block
       which will be handled by CodeBlock component instead */
    const isInline = !className;

    if (isInline) {
      return (
        <code
          className="rounded-md bg-[var(--color-surface-elevated)] px-1.5 py-0.5 font-mono text-sm text-[var(--color-primary)]"
          {...props}
        >
          {children}
        </code>
      );
    }

    /* Fenced code blocks are handled by ContentRenderer → CodeBlock */
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },

  /* Style links with primary color and hover effect */
  a: ({ children, href, ...props }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-[var(--color-primary)] underline decoration-[var(--color-primary)]/30 underline-offset-2 transition-colors duration-200 hover:decoration-[var(--color-primary)]"
      {...props}
    >
      {children}
    </a>
  ),

  /* Style blockquotes with left border accent */
  blockquote: ({ children, ...props }) => (
    <blockquote
      className="border-l-4 border-[var(--color-primary)] pl-4 italic text-[var(--color-muted)]"
      {...props}
    >
      {children}
    </blockquote>
  ),

  /* Style tables with glass surface */
  table: ({ children, ...props }) => (
    <div className="overflow-x-auto rounded-lg border border-[var(--color-border)]">
      <table className="w-full text-sm" {...props}>
        {children}
      </table>
    </div>
  ),

  th: ({ children, ...props }) => (
    <th
      className="bg-[var(--color-surface-elevated)] px-4 py-2 text-left font-semibold"
      {...props}
    >
      {children}
    </th>
  ),

  td: ({ children, ...props }) => (
    <td
      className="border-t border-[var(--color-border)] px-4 py-2"
      {...props}
    >
      {children}
    </td>
  ),

  /* Style unordered lists with custom bullet spacing */
  ul: ({ children, ...props }) => (
    <ul className="space-y-2 pl-6" style={{ listStyleType: "disc" }} {...props}>
      {children}
    </ul>
  ),

  /* Style ordered lists */
  ol: ({ children, ...props }) => (
    <ol className="space-y-2 pl-6" style={{ listStyleType: "decimal" }} {...props}>
      {children}
    </ol>
  ),

  /* Style list items with proper spacing */
  li: ({ children, ...props }) => (
    <li className="leading-relaxed" {...props}>
      {children}
    </li>
  ),

  /* Style headings within content */
  h1: ({ children, ...props }) => (
    <h1 className="mb-4 mt-8 font-heading text-2xl font-bold" {...props}>
      {children}
    </h1>
  ),

  h2: ({ children, ...props }) => (
    <h2 className="mb-3 mt-6 font-heading text-xl font-semibold" {...props}>
      {children}
    </h2>
  ),

  h3: ({ children, ...props }) => (
    <h3 className="mb-2 mt-4 font-heading text-lg font-medium" {...props}>
      {children}
    </h3>
  ),

  /* Style paragraphs with comfortable line height */
  p: ({ children, ...props }) => (
    <p className="leading-[1.7]" {...props}>
      {children}
    </p>
  ),

  /* Style horizontal rules */
  hr: (props) => (
    <hr
      className="my-6 border-[var(--color-border)]"
      {...props}
    />
  ),

  /* Style strong/bold text */
  strong: ({ children, ...props }) => (
    <strong className="font-semibold text-[var(--color-text)]" {...props}>
      {children}
    </strong>
  ),
};
