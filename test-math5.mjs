import React from 'react';
import ReactDOMServer from 'react-dom/server';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

const markdown = String.raw`
$$
\text{Precision} = \frac{TP}{TP + FP}
$$
`;

const element = React.createElement(ReactMarkdown, {
  remarkPlugins: [remarkMath],
  rehypePlugins: [rehypeKatex],
  children: markdown
});

const html = ReactDOMServer.renderToString(element);
console.log(html);
