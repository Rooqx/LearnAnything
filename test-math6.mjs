import React from 'react';
import ReactDOMServer from 'react-dom/server';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

const md1 = String.raw`
$$\text{Precision} = \frac{TP}{TP + FP}$$
`;

const md2 = String.raw`
$$
\text{Precision} = \frac{TP}{TP + FP}
$$
`;

const r1 = ReactDOMServer.renderToString(React.createElement(ReactMarkdown, { remarkPlugins: [remarkMath], rehypePlugins: [rehypeKatex] }, md1));
const r2 = ReactDOMServer.renderToString(React.createElement(ReactMarkdown, { remarkPlugins: [remarkMath], rehypePlugins: [rehypeKatex] }, md2));

console.log("MD1:", r1.includes('katex-display') ? "BLOCK" : "INLINE");
console.log("MD2:", r2.includes('katex-display') ? "BLOCK" : "INLINE");
