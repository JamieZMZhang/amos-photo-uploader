import React from 'react';
import { Button, Typography, TextField } from '@material-ui/core';

export const ImageSlot = React.memo(props => {
    const [text, setText] = React.useState(props.image.text);

    const onTextChange = React.useCallback(
        evt => {
            setText(evt.target.value);
            props.onTextChange(props.iamge.id, evt.target.value);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [props.onTextChange, setText, props.image.id]
    );

    return (
        <div style={{ display: 'flex' }}>
            <Button variant="contained" color="secondary" children="刪除" style={{ alignSelf: 'center' }} onClick={() => props.onDelete(props.iamge.id)} tabIndex={-1} />
            <div style={{ width: 400, Height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '.5rem' }}>
                <img src={props.image.blob} alt="" style={{ maxWidth: 400, maxHeight: 300 }} />
            </div>
            <div style={{ flexGrow: 1 }}>
                <Typography children={props.image.file.name} />
                <TextField multiline fullWidth variant="outlined" value={text} placeholder="圖片說明(100字以內)" rows={3} inputProps={{ maxLength: 100 }} onChange={onTextChange} />
            </div>
        </div>
    )
});