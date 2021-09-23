import React from 'react';
import ReactDOM from 'react-dom';
import Chart from './Chart';

const App = () => (
  <>
    <Chart />
  </>
);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
