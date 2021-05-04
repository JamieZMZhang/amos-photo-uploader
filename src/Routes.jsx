import * as React from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';
import { CategoryManagement } from './pages/CategoryManagement';
import { Gallery } from './pages/Gallery';
import { Upload } from './pages/Upload';

export const Routes = () => {
	return (
		<Switch>
			<Route path="/category" component={CategoryManagement} />
			<Route path="/gallery" component={Gallery} />
			<Route path="/upload" component={Upload} />
			<Redirect to="/upload" />
		</Switch>
	);
};

export default Routes;
