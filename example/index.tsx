// import 'react-app-polyfill/ie11';
import React from 'react';
import ReactDOM from 'react-dom';
import HorizontalScroll from './HorizontalScroll';
import { InfiniteScroll } from '../.';
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
  if (entry.intersectionRatio >= 0.5) {
    return true;
  }
  return false;
};

function LoadMoreComponent() {
  return <h1>New Loader</h1>;
}
function App() {
  const [offsetbottom, setOffsetBottom] = React.useState(0);
  const [typeScroll, setTypeScroll] = React.useState('vertical');
  const option = {
    rootMargin: '0px 0px 300px 0px',
    threshold: '0, 0.5, 1', // changed API to avoid passing array is passed by refernece
    when: true,
    visibilityCondition,
  };
  const [activePageInfo, setActivePageInfo] = React.useState(1);
  const [dataInfiniteScroll, setDataInfiniteScroll] = React.useState(null);
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

  function onChangeRadio(e) {
    setOffsetBottom(e.target.value);
  }

  function onChangeRadioType(e) {
    setTypeScroll(e.target.value);
  }
  return (
    <div className="App">
      <h1>Scroll to see Infinite scroll in action</h1>
      <h3>Offset</h3>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          marginBottom: '30px',
          width: '80%',
          flexDirection: 'column',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div className="radio-item">
            <input
              type="radio"
              name="type-scroll"
              value="vertical"
              checked={typeScroll === 'vertical'}
              onChange={onChangeRadioType}
            />
            <span>Vertical</span>
          </div>
          <div className="radio-item">
            <input
              type="radio"
              name="type-scroll"
              value="horizontal"
              checked={typeScroll === 'horizontal'}
              onChange={onChangeRadioType}
            />
            <span>Horizontal</span>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div className="radio-item">
            <input
              type="radio"
              name="gender"
              value="0"
              onChange={onChangeRadio}
            />
            <span>0</span>
          </div>
          <div className="radio-item">
            <input
              type="radio"
              name="gender"
              value="300"
              onChange={onChangeRadio}
            />
            <span>300</span>
          </div>
          <div className="radio-item">
            <input
              type="radio"
              name="gender"
              value="600"
              onChange={onChangeRadio}
            />
            <span>500</span>
          </div>
        </div>
      </div>
      {typeScroll === 'vertical' && (
        <InfiniteScroll
          callback={callbackForInfiniteScroll}
          options={{
            rootMargin: `0px 0px ${offsetbottom}px 0px`,
            visibilityCondition: (entry: IntersectionObserverEntry) => {
              if (entry.intersectionRatio >= 0.5) {
                return true;
              }
              return false;
            },
            threshold: '0, 0.5, 1',
          }}
        >
          {dataInfiniteScroll &&
            dataInfiniteScroll.map(elem => {
              return <Box key={elem.id} {...elem} typeScroll={typeScroll} />;
            })}
        </InfiniteScroll>
      )}

      {typeScroll === 'horizontal' && (
        <HorizontalScroll
          typeScroll={typeScroll}
          setTypeScroll={setTypeScroll}
          offsetbottom={offsetbottom}
          setOffsetBottom={setOffsetBottom}
        />
      )}
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

ReactDOM.render(<App />, document.getElementById('root'));
