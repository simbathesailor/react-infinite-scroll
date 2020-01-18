import React from 'react';
import { IRefFunctionCallback } from './types';

function useRefCallback(): [null | HTMLElement, Function] {
  const [elem, setElem] = React.useState(null);
  const elemCallbackRef: IRefFunctionCallback = React.useCallback(elem => {
    setElem(elem);
    elemCallbackRef.current = elem;
  }, []);
  return [elem, elemCallbackRef];
}

export default useRefCallback;
