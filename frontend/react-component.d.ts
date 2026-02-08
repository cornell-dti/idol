import React from 'react';

declare module 'react' {
  interface Component {
    refs: Record<string, React.ReactInstance | null>;
  }
}
