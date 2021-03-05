import { Button, Card, CardActions, CardContent, CircularProgress, Container, Dialog, DialogContent, DialogContentText, DialogTitle, Grid, Paper, TextField, Typography } from '@material-ui/core';
import TouchRipple from '@material-ui/core/ButtonBase/TouchRipple';
import { Autocomplete } from '@material-ui/lab';
import axios from 'axios';
import React from 'react';
import { useDropzone } from 'react-dropzone';
import { loadCategories, loadSubCategories } from './helpers/category';
import { ImageSlot } from './ImageSlot';

export const App = () => {
    const [categories, setCategories] = React.useState([]);
    const [selectedCategory, setSelectedCategory] = React.useState(null);
    React.useEffect(
        function onMounted() {
            loadCategories().then(setCategories);
        },
        []
    );

    const [subCategories, setSubCategories] = React.useState([]);
    const [selectedSubCategory, setSelectedSubCategory] = React.useState(null);
    React.useEffect(
        function onSelectedCategoryChanged() {
            if (selectedCategory?.value) {
                loadSubCategories(selectedCategory.value).then(setSubCategories);
            }
        },
        [selectedCategory]
    );

    const [images, setImages] = React.useState([]);
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: '.jpg',
        multiple: true,
        onDrop: React.useCallback(
            files => {
                const imageArr = files.map((file, index) => ({ id: `${+new Date()}${index}`, file, blob: URL.createObjectURL(file), text: '' }));
                setImages(imgs => [...imgs, ...imageArr]);
            },
            [setImages]
        )
    });
    const deleteImage = React.useCallback(
        fileId => {
            setImages(imgs => {
                const index = imgs.find(img => img.id === fileId);

                URL.revokeObjectURL(imgs[index].blob);

                const newArr = [...imgs];
                newArr.splice(index, 1);

                return newArr;
            });
        },
        [setImages]
    );
    const updateText = React.useCallback(
        (fileId, newText) => {
            const index = images.find(img => img.id === fileId);
            images[index].text = newText;
        },
        [images]
    );


    const [uploaded, setUploaded] = React.useState();
    const onUpload = async () => {
        if (!selectedCategory) {
            return alert('請選取分類');
        }

        for (let i = 0; i < images.length; i += 8) {
            setUploaded(i);

            const tpl = await getTpl();

            const f = new FormData();
            f.append('tpl', tpl);
            f.append('useno', 'amosphoto');
            f.append('show_id', selectedCategory.value);
            f.append('show_second_id', selectedSubCategory?.value ?? '');
            f.append('button', '送出');
            for (let j = 0; j < 8; j += 1) {
                f.append(`pic[${j + 1}]`, images[i + j]?.file ?? '');
                f.append(`content[${j + 1}]`, images[i + j]?.text ?? '');
            }
            await axios.post('/store_back/pro_edit.php', f);
        }
        window.location.href = 'https://www.mit-machining.com/store_back/show_list.php';
    };

    return (
        <Container maxWidth="lg">
            {
                uploaded !== undefined &&
                <Dialog open maxWidth="xs">
                    <DialogTitle children="上傳中..." />
                    <DialogContent>
                        <CircularProgress />
                        <br />
                        <DialogContentText children={`正在上傳 ${uploaded + 1}~${Math.min(uploaded + 8, images.length)} / ${images.length}`} />
                    </DialogContent>
                </Dialog>
            }
            <Card>
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="h1" children="圖片批次上傳工具" />
                        </Grid>
                        <Grid item xs={12}>
                            <Button children="重新載入" variant="outlined" onClick={() => loadCategories().then(setCategories)} />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <Autocomplete
                                fullWidth
                                getOptionLabel={item => item?.label ?? ''}
                                value={selectedCategory}
                                renderInput={inputProps => <TextField {...inputProps} required variant="outlined" label="分類" />}
                                options={categories}
                                onChange={(evt, selected) => setSelectedCategory(selected)}
                            />
                        </Grid>
                        {
                            selectedCategory?.value &&
                            <Grid item xs={12} sm={6} md={4}>
                                <Autocomplete
                                    fullWidth
                                    getOptionLabel={item => item?.label ?? ''}
                                    value={selectedSubCategory}
                                    renderInput={inputProps => <TextField {...inputProps} variant="outlined" label="子分類" />}
                                    options={subCategories}
                                    onChange={(evt, selected) => setSelectedSubCategory(selected)}
                                />
                            </Grid>
                        }
                        <Grid item xs={12}>
                            <Paper elevation={4}  {...getRootProps()} style={{ width: '100%', height: 100, background: isDragActive ? 'rgba(0,0,0,0.1)' : undefined }}>
                                <input {...getInputProps()} />
                                <Typography variant="h6" component="p" children="點擊或是拖曳檔案上傳" style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }} />
                                <TouchRipple />
                            </Paper>
                        </Grid>
                        <Grid item xs={12}>
                            {images.map((img, index) => (
                                <ImageSlot key={img.id} image={img} onDelete={deleteImage} onTextChange={updateText} />
                            ))}
                        </Grid>
                    </Grid>
                </CardContent>
                <CardActions style={{ justifyContent: 'flex-end' }}>
                    <Button variant="contained" color="primary" children="上傳" onClick={onUpload} />
                </CardActions>
            </Card>
        </Container>
    );
}

async function getTpl() {
    const { data } = await axios.get('/store_back/show_add.php');
    const dom = document.createElement('html');
    dom.innerHTML = data;
    return dom.querySelector('input[name=tpl]').value;
}