import './event-gallery.scss';
import stockPhoto from '../../images/event_stock_photo.jpg';
import bigStockPhoto from '../../images/big_sample_photo.jpg';
import stockOne from '../../images/1.jpg';
import stockTwo from '../../images/2.jpg';
import stockThree from '../../images/3.jpg';
import stockFour from '../../images/4.jpg';
import stockFive from '../../images/5.jpg';
import stockSix from '../../images/6.jpg';
import stockSeven from '../../images/7.jpg';
import { type KeyboardEvent, type MouseEvent, useState, useRef, useEffect } from 'react';

export function EpEventGallery() {
    const mockImageUrlArray: Array<string> = [
        bigStockPhoto,
        stockPhoto,
        stockOne,
        stockTwo,
        stockThree,
        stockFour,
        stockFive,
        stockSix,
        stockSeven,
    ];
    const mockImagesPreviewArray: Array<string> = mockImageUrlArray.slice(0, 3);
    const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const arrayLength = mockImageUrlArray.length;

    const carouselButtonRef = useRef<HTMLDivElement>(null);
    const galleryPreviewRef = useRef<HTMLDivElement>(null);
    const startLocationX = useRef<number>(0);
    const currentLocationX = useRef<number>(0);

    useEffect(() => {
        carouselButtonRef.current?.setAttribute('autofocus', '');
    }, [carouselButtonRef, galleryPreviewRef]);

    function handleClick(index: number) {
        setSelectedImageIndex(index);
    }

    function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
        if (event.key === 'ArrowRight') {
            changeImage(1);
        } else if (event.key === 'ArrowLeft') {
            changeImage(-1);
        }
    }

    function changeImage(direction: number) {
        const imageIndex = goToImage(direction);
        setSelectedImageIndex(imageIndex);
        galleryPreviewRef.current!.children[imageIndex].scrollIntoView();
    }

    function goToImage(direction: number) {
        return (arrayLength + selectedImageIndex + (direction % arrayLength)) % arrayLength;
    }

    function mouseDown(event: MouseEvent<HTMLDivElement>) {
        startLocationX.current = event.clientX;
        currentLocationX.current = galleryPreviewRef.current!.scrollLeft;
        setIsDragging(true);
    }

    function mouseUp(event: MouseEvent<HTMLDivElement>) {
        startLocationX.current = event.clientX;
        setIsDragging(false);
    }

    function mouseMove(event: MouseEvent<HTMLDivElement>) {
        if (isDragging) {
            galleryPreviewRef.current!.scrollLeft = currentLocationX.current + (startLocationX.current - event.clientX);
        }
    }

    return (
        <div className="EpEventGallery">
            {mockImagesPreviewArray.map((imageURL, idx) => {
                return (
                    <button
                        className="EpEventGallery-imageContainer"
                        popoverTarget="EpEventGallery-carousel"
                        onClick={() => handleClick(idx)}
                        key={idx}
                    >
                        <img className="EpEventGallery-galleryImage" src={imageURL} alt={`image number ${idx}`} />
                    </button>
                );
            })}
            <div
                id="EpEventGallery-carousel"
                popover="auto"
                tabIndex={0}
                onKeyDown={handleKeyDown}
                onMouseUp={mouseUp}
                onMouseMove={mouseMove}
            >
                <div className="EpEventGallery-carouselPage">
                    <div className="EpEventGallery-carouselContainer">
                        <button onClick={() => changeImage(-1)}>
                            <span className="material-symbols-outlined EpEventGallery-arrowSpan">
                                arrow_back_ios_new
                            </span>
                        </button>
                        <div ref={carouselButtonRef} className="EpEventGallery-currentImageContainer" tabIndex={1}>
                            <img
                                className="EpEventGallery-currentImage"
                                src={mockImageUrlArray[selectedImageIndex]}
                                alt={`image number ${selectedImageIndex}`}
                            />
                        </div>
                        <button
                            className="EpEventGallery-closeButton"
                            popoverTarget="EpEventGallery-carousel"
                            popoverTargetAction="hide"
                        >
                            <span className="material-symbols-outlined EpEventGallery-closeSpan">close</span>
                        </button>
                        <button onClick={() => changeImage(1)}>
                            <span className="material-symbols-outlined EpEventGallery-arrowSpan">
                                arrow_forward_ios
                            </span>
                        </button>
                    </div>
                    <div ref={galleryPreviewRef} className="EpEventGallery-preview" onMouseDown={mouseDown}>
                        {mockImageUrlArray.map((imageURL, idx) => {
                            return (
                                <button
                                    className={`EpEventGallery-imageSlider ${selectedImageIndex === idx ? 'active' : ''}`}
                                    onClick={() => handleClick(idx)}
                                    key={idx}
                                >
                                    <img
                                        draggable={false}
                                        className="EpEventGallery-sliderImage"
                                        src={imageURL}
                                        alt={`image number ${idx}`}
                                    />
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
