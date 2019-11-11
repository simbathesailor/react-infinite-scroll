import React from 'react';
import useIntersectionObserver from './useIntersectionObserver';

const defaultVisibilityCondition = (entry: IntersectionObserverEntry) => {
  if (entry.intersectionRatio >= 1) {
    return true;
  }
  return false;
};

const defaultOptions = {
  rootMargin: '0px 0px 0px 0px',
  threshold: '0, 1',
  when: true,
  visibilityCondition: defaultVisibilityCondition,
};

interface IOptions {
  rootMargin?: string;
  threshold?: string;
  when?: boolean;
  visibilityCondition?: (entry: IntersectionObserverEntry) => boolean;
}

function LoadingMore() {
  return <h1>Loading More...</h1>;
}

/**
 * Custom useInfiniteScroll hook which use useIntersectionObserver custom hook
 *
 */
function useInfiniteScroll(options?: IOptions) {
  const [isVisible, boxElemCallback, rootCallbackRef] = useIntersectionObserver(
    options || defaultOptions
  );
  return [boxElemCallback, isVisible, rootCallbackRef];
}
// type JSXElementArray = (JSX.Element | null)[] | [];
// type JSXElementArray = (JSX.Element)[] | [] | null;
// JSX.Element | JSX.Element[]
type JSXElementArray = React.ReactElement | React.ReactElement[];

interface IPropsInfiniteScroll {
  callback?: (isVisible: boolean) => void;
  options?: IOptions;
  LoadMoreComponent?: React.ReactElement;
  whenInfiniteScroll?: boolean;
  children: JSX.Element[] | [];
}

/**
 * InfiniteScroll
 * @param props Infinite scroll component which uses above custom hooks
 */
function InfiniteScroll(props: IPropsInfiniteScroll) {
  const {
    callback,
    options = defaultOptions,
    LoadMoreComponent = null,
    whenInfiniteScroll = true,
  } = props;
  let finalOptions = { ...defaultOptions, ...options };
  const callbackRef = React.useRef(callback);
  const [boxElemCallback, isVisible] = useInfiniteScroll({
    ...finalOptions,
    when: whenInfiniteScroll,
  });

  React.useEffect(() => {
    callbackRef.current = callback;
  });

  const callbackFixed = React.useCallback(
    isVisible => {
      if (whenInfiniteScroll && callbackRef.current) {
        callbackRef.current(isVisible);
      }
    },
    [callbackRef, whenInfiniteScroll]
  );
  React.useEffect(() => {
    if (callbackFixed && whenInfiniteScroll) {
      callbackFixed(isVisible);
    }
  }, [isVisible, callbackFixed, whenInfiniteScroll]);

  let finalReturnChildren: JSXElementArray = [];

  if (props.children) {
    /**
     * props.children can be  array like this, hence need to handle this scenario
     * flatten the children array
     * 0: {$$typeof: Symbol(react.element), type: "h1", key: null, ref: null, props: {…}, …}
     * 1: (10) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
     */
    let flattenChildren: JSX.Element[] = [];
    React.Children.forEach(props.children, child => {
      if (Array.isArray(child)) {
        flattenChildren = [...flattenChildren, ...child];
      } else {
        flattenChildren = [...flattenChildren, child];
      }
    });

    finalReturnChildren = React.Children.map(
      flattenChildren,
      (child, index) => {
        const lastIndex = flattenChildren.length - 1;
        if (index === lastIndex) {
          //   if (!child) return null;
          return React.cloneElement(child, {
            ref: boxElemCallback,
          });
        }
        return child;
      }
    ).filter(elem => elem);
  }
  if (isVisible && finalReturnChildren) {
    finalReturnChildren = [
      ...finalReturnChildren,
      LoadMoreComponent ? (
        React.cloneElement(LoadMoreComponent, {
          key: Math.random(),
        })
      ) : (
        <LoadingMore key={Math.random()} />
        /**
         * Need to think about the correct key value. because this
         * key value may be same as one of the key in list item, right now using Math.random
         */
      ),
    ];
  }
  return <React.Fragment>{finalReturnChildren}</React.Fragment>;
}

/**
 * Infinite scroll in any scrollable area : It will work for any scroll area,
 * as per the findings, It looks like the intersection area is clipped if there is any overflow
 * non-visible property. and hence the intersection area doesnot reach the viewport in that case
 * Read 'Clipping and the intersection rectangle' section here:
 * https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API#root-intersection-rectangle
 */

export { InfiniteScroll };
