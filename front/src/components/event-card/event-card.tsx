import './event-card.scss';
import type { IEvent } from '../../pages/events/events.route.tsx';
import stockImage from '../../images/event_stock_photo.jpg';
import { EpButton } from '../button/button.tsx';
import { useNavigate } from 'react-router-dom';
import { routePaths } from '../../routes.ts';

export function EventCard({ events }: { events: Array<IEvent> | [] }) {
    const navigate = useNavigate();

    return events.map((event, index) => {
        const formatDate = (date: string) => {
            return new Date(date)
                .toLocaleString('en-GB', {
                    year: 'numeric',
                    month: 'short',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                })
                .replace(',', ' • ');
        };
        return (
            <div className="EpEventCard" key={index}>
                <div className="EpEventCard-imageContainer">
                    <span className="EpEventCard-category">category</span>
                    <img className="EpEventCard-image" src={event.imgUrl ?? stockImage} alt="event image" />
                    <span className="EpEventCard-price">$25.00</span>
                </div>
                <div className="EpEventCard-start">
                    <span className="material-symbols-outlined EpEventCard-calendarIcon">calendar_today</span>
                    {formatDate(event.start)}
                </div>
                <div className="EpEventCard-eventName">{event.name}</div>
                <div className="EpEventCard-eventLocation">
                    <span className="material-symbols-outlined EpEventCard-eventLocationIcon">location_on</span>
                    {event.location}
                </div>
                <div className="EpEventCard-buttonContainer">
                    <EpButton onClick={() => navigate(`/${routePaths.event.build(event.id)}`)}>View Details</EpButton>
                </div>
            </div>
        );
    });
}
