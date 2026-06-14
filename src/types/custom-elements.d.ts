import * as React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'lite-youtube': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & { 
        videoid: string; 
        playlabel?: string;
      };
    }
  }
}
