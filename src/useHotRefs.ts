import React from 'react';

// React.MutableRefObject<{ current: any }>
function useHotRefs(value: any): [any] {
  const callbackRef = React.useRef(value);
  React.useEffect(() => {
    callbackRef.current = value;
  });
  return [callbackRef];
}

export default useHotRefs;
