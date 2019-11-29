// import 'react-app-polyfill/ie11';
import React from 'react';
import ReactDOM from 'react-dom';
import { InfiniteScroll } from '../dist';
import './styles.css';

/**
 * forward ref is required as ref is needed on
 */
const Box = React.forwardRef((props, ref) => {
  const { avatar, id, name, typeScroll } = props;
  return (
    <div
      ref={ref}
      style={{
        minHeight: '300px',
        minWidth: '300px',
        marginBottom: typeScroll === 'horizontal' ? '0px' : '40px',
        marginRight: typeScroll === 'horizontal' ? '20px' : '0px',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: 'rgba(0, 0, 0, 0.3) 0px 1px 3px',
        display: 'flex',
        background: '#fff',
        borderRadius: '5px',
      }}
    >
      <img
        style={{ height: '60%', width: '60%', marginBottom: '10px' }}
        src={avatar}
        alt="no-avatar"
      />
      <span>{name}</span>
    </div>
  );
});
const visibilityCondition = (entry: IntersectionObserverEntry) => {
  console.log(entry);
  if (entry.intersectionRatio >= 0.5) {
    return true;
  }
  return false;
};

function LoadMoreComponent() {
  return <h1>New Loader</h1>;
}
function HorizontalScroll({ typeScroll, offsetbottom }) {
  const [activePageInfo, setActivePageInfo] = React.useState(1);
  const [dataInfiniteScroll, setDataInfiniteScroll] = React.useState(null);

  React.useEffect(() => {
    fetch(
      `https://5da9aa08de10b40014f3745c.mockapi.io/api/v1/feed?page=1&limit=10`
    )
      .then(res => {
        return res.json();
      })
      .then(data => {
        setDataInfiniteScroll(data);
      });
  }, []);
  const fetchedStateRef = React.useRef({
    isFetching: false,
    isFetched: false,
    isFailure: false,
  });
  // const callbackForInfiniteScroll = React.useCallback(
  //  ,
  //   [fetchedStateRef]
  // );
  const callbackForInfiniteScroll = isVisible => {
    if (fetchedStateRef.current.isFetching) {
      return;
    }
    let activePage;
    setActivePageInfo(c => {
      activePage = c;
      return c;
    });
    if (isVisible) {
      fetchedStateRef.current = {
        ...fetchedStateRef.current,
        isFetching: true,
      };
      fetch(
        `https://5da9aa08de10b40014f3745c.mockapi.io/api/v1/feed?page=${activePage +
          1}&limit=10`
      )
        .then(res => {
          fetchedStateRef.current = {
            ...fetchedStateRef.current,
            isFetching: false,
            isFetched: true,
            isFailure: false,
          };
          return res.json();
        })
        .then(data => {
          setDataInfiniteScroll(dataInState => [...dataInState, ...data]);
          setActivePageInfo(c => c + 1);
        });
    }
  };
  return (
    <div className="horizontal-scroll">
      <InfiniteScroll
        callback={callbackForInfiniteScroll}
        options={{
          rootMargin: `0px 0px 0px 0px`,
        }}
      >
        {dataInfiniteScroll &&
          dataInfiniteScroll.map(elem => {
            return <Box key={elem.id} {...elem} typeScroll={typeScroll} />;
          })}
      </InfiniteScroll>
    </div>
  );
}

/**
 * Infinite scroll in scrollable area : It will work for any scroll area,
 * as per the findings, It looks like the intersection area is clipped if there is any overflow
 * non-visible property. and hence the intersection area doesnot reach the viewport in that case
 * Read 'Clipping and the intersection rectangle' section here:
 * https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API#root-intersection-rectangle
 */

export default HorizontalScroll;
