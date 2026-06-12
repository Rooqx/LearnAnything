/* ============================================================
   Strip Markdown for TTS
   Cleans AI-generated markdown/LaTeX content so the browser's
   SpeechSynthesis API reads natural, clean sentences — not raw
   syntax like "hashtag hashtag Key Properties colon".

   Stripping pipeline (order matters):
   1. Code blocks → skip entirely
   2. LaTeX/math → skip or read phonetically
   3. HTML tags → strip
   4. Markdown formatting → remove markers, keep text
   5. Whitespace → normalize
   ============================================================ */

/**
 * Strip all markdown and LaTeX formatting from text,
 * producing clean prose suitable for text-to-speech.
 *
 * @param markdown - Raw markdown/LaTeX string from AI response
 * @returns Clean text string for SpeechSynthesis
 */
export function stripMarkdownForTTS(markdown: string): string {
  if (!markdown) return '';

  let text = markdown;

  /* ── 1. Remove fenced code blocks (``` ... ```) ── */
  text = text.replace(/```[\s\S]*?```/g, 'Code example.');

  /* ── 2. Remove inline code (`...`) ── */
  text = text.replace(/`([^`]+)`/g, '$1');

  /* ── 3. Remove block LaTeX ($$...$$) ── */
  text = text.replace(/\$\$[\s\S]*?\$\$/g, 'Math expression.');

  /* ── 4. Convert simple inline LaTeX ($...$) to readable form ── */
  text = text.replace(/\$([^$]+)\$/g, (_match, expr: string) => {
    return convertSimpleLatexToSpeech(expr);
  });

  /* ── 5. Remove images ![alt](url) → "Image: alt" ── */
  text = text.replace(/!\[([^\]]*)\]\([^)]*\)/g, (_match, alt: string) => {
    return alt ? `Image: ${alt}.` : 'Image.';
  });

  /* ── 6. Remove links [text](url) → keep text ── */
  text = text.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1');

  /* ── 7. Remove heading markers (### text → text) ── */
  text = text.replace(/^#{1,6}\s+/gm, '');

  /* ── 8. Remove bold/italic markers ── */
  text = text.replace(/\*\*\*([^*]+)\*\*\*/g, '$1');
  text = text.replace(/\*\*([^*]+)\*\*/g, '$1');
  text = text.replace(/\*([^*]+)\*/g, '$1');
  text = text.replace(/___([^_]+)___/g, '$1');
  text = text.replace(/__([^_]+)__/g, '$1');
  text = text.replace(/_([^_]+)_/g, '$1');

  /* ── 9. Remove strikethrough ── */
  text = text.replace(/~~([^~]+)~~/g, '$1');

  /* ── 10. Remove blockquotes (> text → text) ── */
  text = text.replace(/^>\s+/gm, '');

  /* ── 11. Remove horizontal rules (---, ***, ___) ── */
  text = text.replace(/^[-*_]{3,}\s*$/gm, '');

  /* ── 12. Clean up list markers (-, *, 1.) ── */
  text = text.replace(/^\s*[-*+]\s+/gm, '');
  text = text.replace(/^\s*\d+\.\s+/gm, '');

  /* ── 13. Remove HTML tags ── */
  text = text.replace(/<[^>]+>/g, '');

  /* ── 14. Remove table formatting ── */
  text = text.replace(/\|/g, ',');
  text = text.replace(/^[-:|\s]+$/gm, '');

  /* ── 15. Normalize whitespace ── */
  text = text.replace(/\n{3,}/g, '\n\n');
  text = text.replace(/[ \t]+/g, ' ');
  text = text.trim();

  return text;
}

/**
 * Convert simple LaTeX expressions to spoken English.
 * Complex expressions are skipped with "math expression".
 *
 * @param latex - Raw LaTeX string (without $ delimiters)
 * @returns Spoken-English equivalent
 */
function convertSimpleLatexToSpeech(latex: string): string {
  let spoken = latex.trim();

  /* Skip overly complex expressions */
  if (
    spoken.includes('\\begin') ||
    spoken.includes('\\end') ||
    spoken.includes('\\frac') ||
    spoken.includes('\\int') ||
    spoken.includes('\\sum') ||
    spoken.includes('\\prod') ||
    spoken.includes('\\lim') ||
    spoken.length > 50
  ) {
    return 'math expression';
  }

  /* Replace common LaTeX commands with spoken equivalents */
  spoken = spoken.replace(/\\times/g, ' times ');
  spoken = spoken.replace(/\\div/g, ' divided by ');
  spoken = spoken.replace(/\\cdot/g, ' times ');
  spoken = spoken.replace(/\\pm/g, ' plus or minus ');
  spoken = spoken.replace(/\\neq/g, ' is not equal to ');
  spoken = spoken.replace(/\\leq/g, ' is less than or equal to ');
  spoken = spoken.replace(/\\geq/g, ' is greater than or equal to ');
  spoken = spoken.replace(/\\lt/g, ' is less than ');
  spoken = spoken.replace(/\\gt/g, ' is greater than ');
  spoken = spoken.replace(/\\approx/g, ' is approximately ');
  spoken = spoken.replace(/\\infty/g, ' infinity ');
  spoken = spoken.replace(/\\pi/g, ' pi ');
  spoken = spoken.replace(/\\alpha/g, ' alpha ');
  spoken = spoken.replace(/\\beta/g, ' beta ');
  spoken = spoken.replace(/\\gamma/g, ' gamma ');
  spoken = spoken.replace(/\\theta/g, ' theta ');
  spoken = spoken.replace(/\\sqrt\{([^}]+)\}/g, ' square root of $1 ');
  spoken = spoken.replace(/\^(\{[^}]+\}|\w)/g, (_match, exp: string) => {
    const cleaned = exp.replace(/[{}]/g, '');
    if (cleaned === '2') return ' squared';
    if (cleaned === '3') return ' cubed';
    return ` to the power of ${cleaned}`;
  });
  spoken = spoken.replace(/_(\{[^}]+\}|\w)/g, (_match, sub: string) => {
    const cleaned = sub.replace(/[{}]/g, '');
    return ` sub ${cleaned}`;
  });

  /* Remove remaining backslash commands */
  spoken = spoken.replace(/\\[a-zA-Z]+/g, '');

  /* Remove remaining braces */
  spoken = spoken.replace(/[{}]/g, '');

  /* Replace = with "equals" */
  spoken = spoken.replace(/=/g, ' equals ');

  /* Normalize whitespace */
  spoken = spoken.replace(/\s+/g, ' ').trim();

  return spoken;
}

/**
 * Split text into sentence-based chunks for SpeechSynthesis.
 * The Web Speech API can fail on very long strings (>200 chars),
 * so we split at natural sentence boundaries.
 *
 * @param text - Clean text (already stripped of markdown)
 * @param maxChunkLength - Maximum characters per chunk (default 200)
 * @returns Array of text chunks, each ≤ maxChunkLength
 */
export function splitIntoChunks(text: string, maxChunkLength = 200): string[] {
  if (!text) return [];
  if (text.length <= maxChunkLength) return [text];

  const chunks: string[] = [];

  /* Split on sentence boundaries first */
  const sentences = text.match(/[^.!?]+[.!?]+[\s]*/g) || [text];

  let currentChunk = '';

  for (const sentence of sentences) {
    const trimmedSentence = sentence.trim();

    if (!trimmedSentence) continue;

    /* If adding this sentence would exceed the limit, flush current chunk */
    if (currentChunk.length + trimmedSentence.length > maxChunkLength && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      currentChunk = '';
    }

    /* If a single sentence exceeds the limit, split on commas/semicolons */
    if (trimmedSentence.length > maxChunkLength) {
      const subParts = trimmedSentence.split(/(?<=[,;])\s+/);
      for (const part of subParts) {
        if (currentChunk.length + part.length > maxChunkLength && currentChunk.length > 0) {
          chunks.push(currentChunk.trim());
          currentChunk = '';
        }
        currentChunk += (currentChunk ? ' ' : '') + part;
      }
    } else {
      currentChunk += (currentChunk ? ' ' : '') + trimmedSentence;
    }
  }

  /* Flush remaining content */
  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}
