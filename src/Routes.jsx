import * as React from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';
import { CategoryManagement } from './pages/CategoryManagement';
import { Upload } from './pages/Upload';

export const Routes = () => {
	return (
		<Switch>
			<Route path="/category" component={CategoryManagement} />
			<Route path="/gallery" />
			<Route path="/upload" component={Upload} />
			<Redirect to="/gallery" />
		</Switch>
	);
};

export default Routes;
