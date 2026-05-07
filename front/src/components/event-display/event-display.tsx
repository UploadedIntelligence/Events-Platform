import './event-display.scss';
import { useQuery } from '@tanstack/react-query';
import axios from '../../config/client.ts';
import type { IEvent } from '../../pages/events/events.route.tsx';
import { useParams, useRouteLoaderData } from 'react-router-dom';
import { EpButton } from '../button/button.tsx';
import { Spinner } from '../spinner/spinner.tsx';
import { EpEventGallery } from '../event-gallery/event-gallery.tsx';
import bigStockImage from '../../images/big_sample_photo.jpg';
import { EpEventAttendanceButtonDialog } from '../event-attendance-button-dialog/event-attendance-button-dialog.tsx';
import type { IUser } from '../../utilities/user-permissions.ts';

export interface OrganizerInfo {
    name: string;
    email: string;
    image?: string;
}

export interface IEventResponseWithIncluded {
    data: IEvent;
    included: Array<{ organiser: OrganizerInfo; attendances: Array<Attendance> }>;
}

export interface Attendance {
    id: string;
    userId: string;
    eventId: string;
}

export function EpEventDisplay() {
    const { eventId } = useParams<string>();
    const { data, error, isPending } = useQuery({
        queryKey: ['event', eventId],
        queryFn: () => {
            return axios.get<IEventResponseWithIncluded>(`events/${eventId}`);
        },
    });
    //make server changes to return only the number of users attending/seats left and a boolean whether the current logged user is attending

    const userId = useRouteLoaderData<{ user: IUser }>('UserLandingPage')?.user.id;
    const isUserAttending = !!data?.data.included[0].attendances.some((attendance) => attendance.userId === userId);

    if (isPending) {
        return <Spinner />;
    }

    if (error) {
        return <>error</>;
    }

    const displayEvent: IEvent = {
        ...data.data.data,
    };

    function formatDate(date: string) {
        return new Date(date)
            .toLocaleString('en-GB', {
                year: 'numeric',
                month: 'short',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
            })
            .replace(',', ' • ');
    }

    return (
        <div className="EpEventDisplay">
            <div className="EpEventDisplay-container">
                <div className="EpEventDisplay-imageContainer">
                    <img className="EpEventDisplay-image" src={displayEvent.imgUrl ?? bigStockImage} alt="" />
                </div>
                <div className="EpEventDisplay-detailsContainer">
                    <div className="EpEventDisplay-details">
                        <div className="EpEventDisplay-timeContainer">
                            <div className="EpEventDisplay-timeLabels">
                                <div>start</div>
                                <div>end</div>
                            </div>
                            <div className="EpEventDisplay-timeStartEnd">
                                <div>{formatDate(displayEvent.start)}</div>
                                <div>{formatDate(displayEvent.end)}</div>
                            </div>
                        </div>
                        <div className="EpEventDisplay-name">{displayEvent.name}</div>
                        <div className="EpEventDisplay-location">
                            <span className="material-symbols-outlined EpEventDisplay-locationIcon">location_on</span>
                            <div>{displayEvent.location}</div>
                        </div>
                        <div className="EpEventDisplay-about">{displayEvent.description}</div>
                        <div className="EpEventDisplay-gallery" id="EpEventDisplay-gallery">
                            <div className="EpEventDisplay-galleryHeader">
                                <h2>Gallery</h2>
                                <div className="EpEventDisplay-galleryButton">
                                    <EpButton variant="ghost" popoverTarget="EpEventGallery-carousel">
                                        View all photos
                                    </EpButton>
                                </div>
                            </div>
                            <EpEventGallery />
                        </div>
                        <div className="EpEventDisplay-organizer" id="EpEventDisplay-organizer">
                            <div>Profile image</div>
                            <div>Name</div>
                            <div>{displayEvent.organiserId}</div>
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
                        href={'#EpEventDisplay-organizer'}
                        aria-current="false"
                        onClick={(event) => event.currentTarget.setAttribute('aria-current', 'true')}
                    >
                        Organizer
                    </a>
                </div>

                <div className="EpEventDisplay-ticket">
                    <div className="EpEventDisplay-ticketPrice">
                        <div>Price</div>
                    </div>
                    <div className="EpEventDisplay-ticketButtons">
                        <div className="EpEventDisplay-buttonsContainer">
                            {isUserAttending ? (
                                <EpButton popoverTarget="EpEventAttendanceButtonDialog" variant="cancel">
                                    <span className="material-symbols-outlined EpEventDisplay-cancelIcon">cancel</span>
                                    Cancel Attendance
                                </EpButton>
                            ) : (
                                <EpButton popoverTarget="EpEventAttendanceButtonDialog">Attend</EpButton>
                            )}
                            <EpEventAttendanceButtonDialog eventData={data.data} isUserAttending={isUserAttending} />
                        </div>

                        <EpButton variant="secondary">
                            <span className="material-symbols-outlined EpEventDisplay-bookmarkIcon">bookmark</span>
                            Save event
                        </EpButton>
                    </div>
                    <div className="EpEventDisplay-ticketTerms">
                        No hidden fees at checkout. Full refund available up to 48h before event.
                    </div>
                </div>
            </aside>
        </div>
    );
}
