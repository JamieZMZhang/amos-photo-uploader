import { AppBar, CssBaseline, Tab, Tabs, Toolbar, Typography } from '@material-ui/core';
import React from 'react';
import { useHistory, useLocation } from 'react-router';
import { Routes } from './Routes';

export const App = () => {
	return (
		<>
			<CssBaseline />
			<Header />
			<Routes />
		</>
	);
}

function Header() {
	const location = useLocation();
	const history = useHistory();
	return (
		<AppBar position="sticky">
			<Toolbar>
				<Typography variant="h5" component="h1" children="網站工具" />
				<Tabs value={location.pathname} onChange={(e, selectedTab) => history.push(selectedTab)} style={{ marginLeft: '1rem' }}>
					<Tab value="/category" label="分類管理" />
					<Tab value="/gallery" label="圖片管理" />
					<Tab value="/upload" label="圖片上傳" />
				</Tabs>
			</Toolbar>
		</AppBar>
	);
}