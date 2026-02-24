import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeMathjax from "rehype-mathjax";

// Your single string from the database
const dbContent =
  "Here is some text. \n\n ```javascript\n console.log('hello');\n``` \n\n And here is math: $$ E = mc^2 $$";

export default function CourseChapter() {
  return (
    <div className="chapter-container">
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeMathjax]}
        components={{
          // 1. Tell it how to handle code blocks
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              // THIS IS YOUR CUSTOM UI BLOCK!
              // It automatically drops it right in the flow of the text.
              <div className="my-special-code-block-ui">
                <div className="block-header">{match[1]}</div>
                <code>{children}</code>
              </div>
            ) : (
              // This handles the short oneliners like `<a>`
              <code className="my-inline-highlight" {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {dbContent}
      </ReactMarkdown>
    </div>
  );
}
