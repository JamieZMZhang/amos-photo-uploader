import { CssBaseline } from '@material-ui/core';
import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';
import reportWebVitals from './reportWebVitals';

switch (window.location.hostname) {
  case 'www.mit-machining.com':
  case 'localhost':
    document.head.querySelectorAll('link').forEach(tag=>tag.remove());
    document.body.innerHTML ='<div id="root"></div>';

    ReactDOM.render(
      <>
        <CssBaseline />
        <App />
      </>,
      document.getElementById('root')
    );

    // If you want to start measuring performance in your app, pass a function
    // to log results (for example: reportWebVitals(console.log))
    // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
    reportWebVitals();
    break;
  default:
    alert('請到登入你的後台網站後，使用本工具');
}