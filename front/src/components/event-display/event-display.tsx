import './event-display.scss';
import { useQuery } from '@tanstack/react-query';
import axios from '../../config/client.ts';
import type { IEvents } from '../../pages/landing-page/events/events.route.tsx';
import { useParams } from 'react-router-dom';
import { EpButton } from '../button/button.tsx';
import { Spinner } from '../spinner/spinner.tsx';
import { EpEventGallery } from '../event-gallery/event-gallery.tsx';
import bigStockImage from '../../images/big_sample_photo.jpg';
import { EpEventAttendButton } from '../event-attend-button/event-attend-button.tsx';

export interface OrganizerInfo {
    name: string;
    email: string;
    image?: string;
}

export function EpEventDisplay() {
    const { eventId } = useParams<string>();
    const { data, error, isPending } = useQuery({
        queryKey: [eventId],
        queryFn: () => {
            return axios.get<{ data: IEvents & { included: Array<OrganizerInfo> } }>(`events/${eventId}`);
        },
    });

    if (isPending) {
        return <Spinner />;
    }

    if (error) {
        return <>error</>;
    }

    const displayEvent: IEvents = {
        ...data.data.data,
    };

    console.log(data);

    return (
        <div className="EpEventDisplay">
            <div className="EpEventDisplay-container">
                <div className="EpEventDisplay-imageContainer">
                    <img className="EpEventDisplay-image" src={displayEvent.imgUrl ?? bigStockImage} alt="" />
                </div>
                <div className="EpEventDisplay-details">
                    <div className="EpEventDisplay-detailsContainer">
                        <h2 className="EpEventDisplay-name">{displayEvent.name}</h2>
                        <div className="EpEventDisplay-about" id="EpEventDisplay-about">
                            {displayEvent.description}
                        </div>
                        <div className="EpEventDisplay-gallery" id="EpEventDisplay-gallery">
                            <div className="EpEventDisplay-galleryHeader">
                                <h2 id="gallery">Gallery</h2>
                                <div className="EpEventDisplay-galleryButton">
                                    <EpButton variant="ghost">View all photos</EpButton>
                                </div>
                            </div>
                            <EpEventGallery />
                        </div>
                        <div className="EpEventDisplay-location" id="EpEventDisplay-location">
                            <h2>Location</h2>
                            <div>
                                <p>Venue</p>
                                <p>Address</p>
                            </div>
                        </div>
                        <div className="EpEventDisplay-organizer" id="EpEventDisplay-organizer">
                            <div>Profile image</div>
                            <div>Name</div>
                            <div>{displayEvent.organiserId}asd</div>
                            <div>Bio info</div>
                            <div className="EpEventDisplay-buttonsContainer">
                                <button className="EpEventDisplay-followButton">
                                    <span className="material-symbols-outlined person_add">person_add</span>
                                    Follow
                                </button>
                                <button className="EpEventDisplay-contactButton">
                                    <span className="material-symbols-outlined mail">mail</span>
                                    Contact
                                </button>
                            </div>
                            <div>
                                <div>
                                    <p>XXX</p>
                                    <p>Events</p>
                                </div>
                                <div>
                                    <p>XXX</p>
                                    <p>Followers</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="EpEventDisplay-userAttendance">
                        <div className="EpEventDisplay-attendOrCancel"></div>
                    </div>
                </div>
            </div>

            <aside className="EpEventDisplay-sidebarContainer">
                <div className="EpEventDisplay-navigationMenu">
                    <a className="EpEventDisplay-navigationOption" href={'#EpEventDisplay-about'} aria-current="false">
                        About
                    </a>
                    <a
                        className="EpEventDisplay-navigationOption"
                        href={'#EpEventDisplay-gallery'}
                        aria-current="false"
                    >
                        Gallery
                    </a>
                    <a
                        className="EpEventDisplay-navigationOption"
                        href={'#EpEventDisplay-location'}
                        aria-current="false"
                    >
                        Location
                    </a>
                    <a
                        className="EpEventDisplay-navigationOption"
                        href={'#EpEventDisplay-organizer'}
                        aria-current="false"
                        onClick={(event) => event.currentTarget.setAttribute('aria-current', 'true')}
                    >
                        Organizer
                    </a>
                </div>

                <div className="EpEventDisplay-tickets">
                    <div className="EpEventDisplay-ticketInfo">
                        <p>Price</p>
                    </div>
                    <div className="EpEventDisplay-ticketButtons">
                        <EpEventAttendButton>Attend</EpEventAttendButton>
                        <EpButton variant="secondary">
                            <span className="material-symbols-outlined bookmark">bookmark</span>
                            Save event
                        </EpButton>
                    </div>
                </div>
            </aside>
        </div>
    );
}
