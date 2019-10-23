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
  rootMargin: string;
  threshold: string;
  when: boolean;
  visibilityCondition: (entry: IntersectionObserverEntry) => boolean;
}

function LoadingMore() {
  return <h1>Loading More...</h1>;
}

function useInfiniteScroll(options?: IOptions) {
  const [isVisible, boxElemCallback, rootCallbackRef] = useIntersectionObserver(
    options || defaultOptions
  );
  return [boxElemCallback, isVisible, rootCallbackRef];
}
type JSXElementArray = JSX.Element[] | [];
interface IPropsInfiniteScroll {
  callback?: (isVisible: boolean) => void;
  options?: IOptions;
  LoadMoreComponent?: React.ReactType;
  whenInfiniteScroll?: boolean;
  children: JSX.Element[] | [];
}

function InfiniteScroll(props: IPropsInfiniteScroll) {
  const {
    callback,
    options = defaultOptions,
    LoadMoreComponent,
    whenInfiniteScroll = true,
  } = props;
  const [boxElemCallback, isVisible] = useInfiniteScroll({
    ...options,
    when: whenInfiniteScroll,
  });
  const callbackFixed = React.useCallback(
    isVisible => {
      if (whenInfiniteScroll && callback) {
        callback(isVisible);
      }
    },
    [callback, whenInfiniteScroll]
  );
  React.useEffect(() => {
    if (callbackFixed && whenInfiniteScroll) {
      callbackFixed(isVisible);
    }
  }, [isVisible, callbackFixed, whenInfiniteScroll]);
  let finalReturnChildren: JSXElementArray = [];

  if (props.children) {
    finalReturnChildren = React.Children.map(props.children, (child, index) => {
      const lastIndex = props.children.length - 1;
      if (index === lastIndex) {
        return React.cloneElement(child, {
          ref: boxElemCallback,
        });
      }
      return child;
    });
  }
  if (isVisible && finalReturnChildren) {
    finalReturnChildren = [
      ...finalReturnChildren,
      LoadMoreComponent ? (
        <LoadMoreComponent />
      ) : (
        <LoadingMore key={props.children.length} />
      ),
    ];
  }
  return finalReturnChildren;
}

export { useInfiniteScroll, InfiniteScroll };
