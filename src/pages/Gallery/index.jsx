import { AppBar, Checkbox, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Toolbar } from '@material-ui/core';
import * as React from 'react';
import { loadPhotos } from '../../helpers/photo';

export const Gallery = () => {
	const [photos, setPhotos] = React.useState([]);

	const [loading, setLoading] = React.useState(false);
	const pageRef = React.useRef(1);
	const allLoadedRef = React.useRef(false);

	React.useEffect(
		() => {
			loadPhotos({ page: 1 }).then(data => setPhotos(p => p.concat(data)));
		},
		[setPhotos]
	);

	const lastSelectIndex = React.useRef(null);
	const [selected, setSelected] = React.useState([]);
	const onPhotoSelect = index => ({ nativeEvent: evt }, checked) => {
		if (!evt.shiftKey) {
			if (checked) {
				setSelected(s => s.concat(photos[index]));
			} else {
				setSelected(s => s.filter(x => x !== photos[index]));
			}
		} else if (lastSelectIndex.current >= 0) {
			const start = Math.min(lastSelectIndex.current, index);
			const end = Math.max(lastSelectIndex.current, index) + 1;
			const range = photos.slice(start, end);
			if (checked) {
				setSelected(s => s.concat(range));
			} else {
				setSelected(s => s.filter(x => !range.includes(x)));
			}
		}
		lastSelectIndex.current = index;
	};
	return (
		<Container maxWidth="lg" style={{ padding: '.5rem', position: 'relative' }}>
			<AppBar position="sticky" color="default" elevation={0}>
				<Toolbar>

				</Toolbar>
			</AppBar>
			<TableContainer component={Paper} >
				<Table>
					<TableHead>
						<TableRow>
							<TableCell />
							<TableCell children="分類" />
							<TableCell children="子分類" />
							<TableCell style={{ width: 160 }} children="圖片" />
						</TableRow>
					</TableHead>
					<TableBody>
						{photos.map((photo, index) => (
							<TableRow key={photo.id}>
								<TableCell padding="checkbox">
									<Checkbox checked={selected.includes(photo)} onChange={onPhotoSelect(index)} />
								</TableCell>
								<TableCell children={photo.category} />
								<TableCell children={photo.subcategory} />
								<TableCell>
									<img src={photo.link} alt="圖片" style={{ maxHeight: 100, maxWidth: 160 }} />
								</TableCell>
							</TableRow>
						))}
						{photos.length === 0 && (
							<TableRow>
								<TableCell colSpan={4} align="center" children="沒有任何圖片" />
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>
		</Container>
	);
};