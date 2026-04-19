import './event-card.scss';
import type { IEvents } from '../../pages/landing-page/events/events.route.tsx';
import stockImage from '../../images/event_stock_photo.jpg';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import { EpButton } from '../button/button.tsx';
import { useNavigate } from 'react-router-dom';

export function EventCard({ events }: { events: Array<IEvents> | [] }) {
    const navigate = useNavigate();
    function eventDetails(eventID: string) {
        navigate(`/events/${eventID}`);
    }

    return events.map((event, index) => {
        const formatDate = (date: string) => {
            return new Date(date).toLocaleString('en-GB', {
                year: 'numeric',
                month: 'short',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
            });
        };
        return (
            <div className="EpEventCard" key={index}>
                <div className="EpEventCard-imageContainer">
                    <span className="EpEventCard-category">category</span>
                    <img className="EpEventCard-image" src={event.imgUrl ?? stockImage} alt="event image" />
                    <span className="EpEventCard-price">$25.00</span>
                </div>
                <p className="EpEventCard-start">
                    <CalendarTodayOutlinedIcon sx={{ justifySelf: 'start', fontSize: '1.25em' }} />{' '}
                    {formatDate(event.start).replace(',', ' • ')}
                </p>
                <p className="EpEventCard-eventName">{event.name}</p>
                <p className="EpEventCard-eventLocation">
                    <LocationOnOutlinedIcon className="EpEventCard-eventLocationIcon" fontSize="inherit" />
                    {event.location}
                </p>
                <div className="EpEventCard-buttonContainer">
                    <EpButton onClick={() => eventDetails(event.id)}>View Details</EpButton>
                </div>
            </div>
        );
    });
}
