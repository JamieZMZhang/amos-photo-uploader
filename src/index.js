import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';
import { HashRouter } from 'react-router-dom';

switch (window.location.hostname) {
    case 'www.mit-machining.com':
    case 'localhost':
        document.head.querySelectorAll('link').forEach(tag => tag.remove());
        document.body.innerHTML = '<div id="root"></div>';

        ReactDOM.render(
            <HashRouter>
                <App />
            </HashRouter>,
            document.getElementById('root')
        );
        break;
    default:
        alert('請到登入你的後台網站後，使用本工具');
}