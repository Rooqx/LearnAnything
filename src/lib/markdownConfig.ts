/* ============================================================
   Markdown Configuration
   Configures react-markdown with remark/rehype plugins for
   rendering AI-generated course content.

   Plugin pipeline:
   1. remark-gfm: GitHub Flavored Markdown (tables, checkboxes)
   2. remark-math: Detect math syntax ($..$ and $$..$$)
   3. rehype-katex: Render detected math with KaTeX

   Custom component overrides are defined here but the actual
   React components (CodeBlock, MathBlock) are in
   components/learning/ and composed in ContentRenderer.
   ============================================================ */

import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

/**
 * Remark plugins for the react-markdown pipeline.
 * Applied in order: GFM tables/checkboxes → math detection.
 */
export const remarkPlugins = [remarkGfm, remarkMath];

/**
 * Rehype plugins for the react-markdown pipeline.
 * Applied after remark: KaTeX rendering of detected math.
 */
export const rehypePlugins = [rehypeKatex];

/**
 * Default markdown rendering options.
 * Used when creating the react-markdown component.
 */
export const markdownConfig = {
  remarkPlugins,
  rehypePlugins,
} as const;
