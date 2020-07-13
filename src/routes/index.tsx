import React from 'react';
import Home from '../pages/Home';
import Video from '../pages/Video';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

const Root: React.FC = () => (
    <BrowserRouter>
        <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/:id" component={Video} />
            <Redirect path="*" to="/" />
        </Switch>
    </BrowserRouter>
);

export default Root;