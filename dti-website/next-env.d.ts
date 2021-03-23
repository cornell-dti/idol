/// <reference types="next" />
/// <reference types="next/types/global" />
/// <reference types="common-types" />

declare module '*.svg' {
  import * as React from 'react';

  const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & { title?: string }
  >;
  export default ReactComponent;
}
