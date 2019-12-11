import React from 'react';
import ReactDOM from 'react-dom';
// import { BrowserRouter, Route, Redirect } from "react-router-dom";
import {Provider} from 'react-redux';
import selectPlugin from '@rematch/select';
import {init} from '@rematch/core';
import App from './pages/app';
import * as models from './models';
import './index.css';

const store = init({
  plugins: [selectPlugin()],
  models,
});

ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('root'),
);
