// import 'react-app-polyfill/ie11';
import React from 'react';
import ReactDOM from 'react-dom';
import InfiniteScroll from '../.';
import './styles.css';

/**
 * forward ref is required as ref is needed on
 */
const Box = React.forwardRef((props, ref) => {
  const { avatar, id, name } = props;
  return (
    <div
      ref={ref}
      style={{
        height: '300px',
        width: '300px',
        marginBottom: '40px',
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
  if (entry.intersectionRatio >= 0.5) {
    return true;
  }
  return false;
};

function LoadMoreComponent() {
  return <h1>New Loader</h1>;
}
function App() {
  const option = {
    rootMargin: '0px 0px 300px 0px',
    threshold: '0, 0.5, 1', // changed API to avoid passing array is passed by refernece
    when: true,
    visibilityCondition,
  };
  const [activePageInfo, setActivePageInfo] = React.useState(1);
  const [dataInfiniteScroll, setDataInfiniteScroll] = React.useState(null);
  // const option = useOptionCreator(boxRef, documentRef);
  // const [isVisible, boxElemCallback] = useIntersectionObserver(option);
  const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

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
  const callbackForInfiniteScroll = React.useCallback(
    isVisible => {
      let activePage;
      setActivePageInfo(c => {
        activePage = c;
        return c;
      });
      if (isVisible) {
        fetch(
          `https://5da9aa08de10b40014f3745c.mockapi.io/api/v1/feed?page=${activePage +
            1}&limit=10`
        )
          .then(res => {
            return res.json();
          })
          .then(data => {
            setDataInfiniteScroll(dataInState => [...dataInState, ...data]);
            setActivePageInfo(c => c + 1);
          });
      }
    },
    [setActivePageInfo]
  );
  return (
    <div className="App">
      <h1>Scroll to see Infinite scroll in action</h1>
      <InfiniteScroll callback={callbackForInfiniteScroll}>
        {dataInfiniteScroll &&
          dataInfiniteScroll.map(elem => {
            return <Box key={elem.id} {...elem} />;
          })}
      </InfiniteScroll>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
