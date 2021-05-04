import { Button, Card, CardActions, CardContent, Container, DialogContentText, Grid, LinearProgress } from '@material-ui/core';
import React from 'react';
import { ReactSortable } from 'react-sortablejs';
import { ConfirmPageChange } from '../../components/ConfirmPageChange';
import { uploadPhotos } from '../../helpers/photo';
import { LoadingDialog } from './../../components/LoadingDialog';
import { CategoryDropdown } from './CategoryDropdown';
import { FileDropzone } from './FileDropzone';
import { PhotoRow } from './PhotoRow';
import { SubcategoryDropdown } from './SubcategoryDropdown';


export const Upload = () => {
	const [selectedCategory, setSelectedCategory] = React.useState(null);
	const [selectedSubCategory, setSelectedSubCategory] = React.useState(null);
	const [photos, setPhotos] = React.useState([]);

	const onAppendPhotos = React.useCallback(
		files => {
			const imageArr = files.map(file => ({ objectUrl: URL.createObjectURL(file), file, text: '' }));
			setPhotos(imgs => imgs.concat(imageArr));
		},
		[setPhotos]
	);
	const onDeletePhoto = React.useCallback(
		photo => {
			setPhotos(imgs => {
				const index = imgs.findIndex(img => img.objectUrl === photo.objectUrl);

				URL.revokeObjectURL(imgs[index].objectUrl);

				const newArr = [...imgs];
				newArr.splice(index, 1);

				return newArr;
			});
		},
		[setPhotos]
	);
	const onPhotoTextUpdate = React.useCallback(
		(photo, newText) => {
			const target = photos.find(img => img.objectUrl === photo.objectUrl);
			target.text = newText;
		},
		[photos]
	);
	const clearPhotos = () => {
		photos.forEach(photo => URL.revokeObjectURL(photo.objectUrl));
		setPhotos([]);
	};

	const [uploadProgress, setUploadProgress] = React.useState();
	const onUpload = async () => {
		if (!selectedCategory) return alert('請選取分類');

		await uploadPhotos({
			categoryId: selectedCategory.value,
			subCategoryId: setSelectedSubCategory?.value,
			photos: photos,
			onProgress: setUploadProgress
		});
		setUploadProgress(100);
		clearPhotos();
	};

	return (
		<Container maxWidth="lg" style={{ padding: '.5rem' }}>
			<ConfirmPageChange when={!!photos.length} message="圖片還沒有上傳，離開頁面會清空列表，確定要離開嗎？" />
			<Card>
				<CardContent>
					<Grid container spacing={2}>
						<Grid item xs={12} sm={6} md={4}>
							<CategoryDropdown value={selectedCategory} onChange={setSelectedCategory} />
						</Grid>
						{
							selectedCategory?.value &&
							<Grid item xs={12} sm={6} md={4}>
								<SubcategoryDropdown
									value={selectedSubCategory}
									onChange={setSelectedSubCategory}
									parentId={selectedCategory.value}
								/>
							</Grid>
						}
						<Grid item xs={12}>
							<FileDropzone onAddFiles={onAppendPhotos} />
						</Grid>
						<Grid item xs={12}>
							<ReactSortable
								list={photos}
								setList={setPhotos}
								handle=".drag-handle"
							>
								{photos.map(photo => (
									<PhotoRow
										key={photo.objectUrl}
										photo={photo}
										onDelete={onDeletePhoto}
										onTextChange={onPhotoTextUpdate} />
								))}
							</ReactSortable>
						</Grid>
					</Grid>
				</CardContent>
				<CardActions style={{ justifyContent: 'flex-end' }}>
					<Button variant="contained" color="primary" children="上傳" onClick={onUpload} />
				</CardActions>
			</Card>
			{uploadProgress !== undefined && uploadProgress < 100 && (
				<LoadingDialog
					title={`正在上傳${photos.length}張圖片`}
					message={
						<>
							<LinearProgress style={{ height: 8 }} value={uploadProgress} variant="determinate" />
							<DialogContentText children={`上傳中： ${uploadProgress}%`} style={{ marginTop: '.5rem' }} />
						</>
					}
				/>
			)}

		</Container >
	);
}
