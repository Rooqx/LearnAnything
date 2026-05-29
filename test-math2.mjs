import React from 'react';
import ReactDOMServer from 'react-dom/server';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

const markdown = `
**Precision**
Focuses on the quality of positive predictions. "Of all predicted positives, how many were actually positive?"
$$\text{Precision} = \frac{TP}{TP + FP}$$
`;

const element = React.createElement(ReactMarkdown, {
  remarkPlugins: [remarkMath],
  rehypePlugins: [rehypeKatex],
  children: markdown
});

const html = ReactDOMServer.renderToString(element);
console.log(html);
