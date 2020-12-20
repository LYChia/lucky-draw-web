import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import loadLocales from './locales';
const serverConfig = require('./config/serverConfig.json');
global.webUrl = serverConfig.webUrl;
global.apiUrl = serverConfig.apiUrl;

loadLocales();

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
