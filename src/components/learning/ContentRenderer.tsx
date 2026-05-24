"use client";

import ReactMarkdown from "react-markdown";
import { remarkPlugins, rehypePlugins, markdownComponents } from "@/lib/markdownConfig";
import type { ContentBlock } from "@/types";

/** Detects content type and renders the correct block */
export function ContentRenderer({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case "text":
    case "bullet-list":
      return (
        <div className="prose-custom leading-[1.7]">
          <ReactMarkdown remarkPlugins={remarkPlugins} rehypePlugins={rehypePlugins} components={markdownComponents}>
            {block.content}
          </ReactMarkdown>
        </div>
      );
    case "code":
      return (
        <div className="my-4 overflow-hidden rounded-[var(--radius-md)] bg-[#1A1530]">
          <div className="flex items-center justify-between px-4 py-2 text-xs text-[var(--color-muted)]">
            <span>{block.language || "code"}</span>
          </div>
          <pre className="overflow-x-auto p-4 text-sm font-mono text-[#F8F6FF]"><code>{block.content}</code></pre>
        </div>
      );
    case "math":
      return (
        <div className="my-4 rounded-[var(--radius-md)] bg-[var(--color-primary)]/10 p-4">
          <ReactMarkdown remarkPlugins={remarkPlugins} rehypePlugins={rehypePlugins}>{`$$${block.content}$$`}</ReactMarkdown>
        </div>
      );
    default:
      return <p>{block.content}</p>;
  }
}
