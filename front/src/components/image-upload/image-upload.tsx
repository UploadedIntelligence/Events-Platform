import './image-upload.scss';
import React, { useState, useRef, useImperativeHandle } from 'react';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

export function EpImageUpload({ ref, ...props }: React.ComponentPropsWithRef<'input'>) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(null);

    useImperativeHandle(ref, () => inputRef.current!);

    function removeImage(event: React.MouseEvent<HTMLButtonElement>) {
        event.stopPropagation();
        setPreview(null);
    }

    function handleClick() {
        inputRef.current?.click();
    }

    function handleDragOver(event: React.DragEvent) {
        event.preventDefault();
    }

    function handleDrop(event: React.DragEvent) {
        event.preventDefault();
        const files = event.dataTransfer.files;
        if (files) {
            setPreview(createImgSource(files));
            inputRef.current!.files = files;
            props.onChange?.({ target: inputRef.current! } as React.ChangeEvent<HTMLInputElement>);
        }
    }

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const files: FileList | null = event.target.files;
        if (files) {
            setPreview(createImgSource(files));
            if (props.onChange) {
                props.onChange(event);
            }
        }
    }

    function createImgSource(files: FileList): string {
        return URL.createObjectURL(files[0]);
    }

    return (
        <div className="EpImageUpload">
            <div
                className="EpImageUpload-dropZone"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={handleClick}
            >
                <input
                    {...props}
                    ref={inputRef}
                    className="EpImageUpload-input"
                    type="file"
                    accept="image/png image/jpg"
                    onChange={handleChange}
                />
                {preview ? (
                    <>
                        <img className="EpImageUpload-image" src={preview} alt="" />
                        <button className="EpImageUpload-clearImage" onClick={removeImage}>
                            <DeleteForeverIcon
                                sx={{
                                    color: 'red',
                                    fontSize: '2.5em',
                                }}
                            />
                        </button>
                    </>
                ) : (
                    <>
                        <div className="EpImageUpload-iconContainer">
                            <span className="material-symbols-outlined">cloud_upload</span>
                        </div>
                        <span className="EpImageUpload-instructions--bold">Drag and drop your event cover</span>
                        <span className="EpImageUpload-instructions">Or browse files from your computer</span>
                        <span className="EpImageUpload-instructions">Recommended ratio 16 : 9</span>
                        <span className="EpImageUpload-instructions">FORMAT MUST BE JPG / PNG</span>
                    </>
                )}
            </div>
        </div>
    );
}
