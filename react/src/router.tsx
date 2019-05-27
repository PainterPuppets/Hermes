import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import HomePageContainer from './homepage/containers/HomePageContainer';


export default () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" component={HomePageContainer} />
      </Switch>
    </BrowserRouter>
  )
}