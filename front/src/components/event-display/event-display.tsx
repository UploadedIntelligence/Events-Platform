import './event-display.scss';
import { useQuery } from '@tanstack/react-query';
import axios from '../../config/client.ts';
import type { IUserEvents } from '../../pages/landing-page/user-landing-page/user-events.tsx';
import { useParams } from 'react-router-dom';
import { EpButton } from '../button/button.tsx';
import { Spinner } from '../spinner/spinner.tsx';
import { EpEventGallery } from '../event-gallery/event-gallery.tsx';
import bigStockImage from '../../images/big_sample_photo.jpg';
// import { AttendOrCancelEventDialog } from "../attend-event-dialog.tsx";
// import { useState } from "react";

export function EpEventDisplay() {
    // const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    // const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
    const { eventID } = useParams<string>();
    const { data, error, isPending } = useQuery({
        queryKey: [eventID],
        queryFn: () => {
            return axios.get(`event-details/${eventID}`);
        },
    });

    if (isPending) {
        return <Spinner />;
    }

    if (error) {
        return <>error</>;
    }

    const displayEvent: IUserEvents = {
        ...data.data,
        actions: [
            { title: 'Cancel attendance' },
            { type: 'past or future event' },
            // {action: () => {
            //     setSelectedEventId(displayEvent.id);
            //     setDialogOpen(true);
            // }},
        ],
    };

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
                <div>
                    {displayEvent.actions?.map((action, idx) => {
                        if (action !== null) {
                            return <EpButton key={idx}>{action.title}</EpButton>;
                        }
                    })}
                </div>
            </div>

            <aside className="EpEventDisplay-sidebarContainer">
                <div className="EpEventDisplay-navigationMenu">
                    <a className="EpEventDisplay-navigationOption" href={'#EpEventDisplay-about'} aria-current="true">
                        About
                    </a>
                    <a className="EpEventDisplay-navigationOption" href={'#EpEventDisplay-gallery'} aria-current="true">
                        Gallery
                    </a>
                    <a
                        className="EpEventDisplay-navigationOption"
                        href={'#EpEventDisplay-location'}
                        aria-current="true"
                    >
                        Location
                    </a>
                    <a
                        className="EpEventDisplay-navigationOption"
                        href={'#EpEventDisplay-organizer'}
                        aria-current="true"
                        onClick={(event) => event.currentTarget.setAttribute('aria-current', 'false')}
                    >
                        Organizer
                    </a>
                </div>

                <div className="EpEventDisplay-tickets">
                    <div className="EpEventDisplay-ticketInfo">
                        <p>Price</p>
                    </div>
                    <div className="EpEventDisplay-ticketButtons">
                        <EpButton>Attend</EpButton>
                        <EpButton variant="secondary">
                            <span className="material-symbols-outlined bookmark">bookmark</span>
                            Save event
                        </EpButton>
                    </div>
                </div>
            </aside>
            {/*<AttendOrCancelEventDialog*/}
            {/*    eventUrl='needs to be changed to type of event, like past/future/history/attending'*/}
            {/*    dialogOpen={dialogOpen}*/}
            {/*    selectedEventId={selectedEventId}*/}
            {/*    setDialogOpen={setDialogOpen}*/}
            {/*/>*/}
        </div>
    );
}
