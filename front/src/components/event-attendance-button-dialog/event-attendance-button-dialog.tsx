import './event-attendance-button-dialog.scss';
import { EpButton } from '../button/button.tsx';
import axios from '../../config/client.ts';
import QueryClient from '../../services/tanstack-query-client.ts';
import { useMutation } from '@tanstack/react-query';
import type { IEventResponseWithIncluded } from '../event-display/event-display.tsx';
import { routePaths } from '../../routes.ts';

export function EpEventAttendanceButtonDialog({
    eventData,
    isUserAttending,
}: {
    eventData: IEventResponseWithIncluded;
    isUserAttending: boolean;
}) {
    const cancelAttendance = useMutation({
        mutationFn: () => {
            return axios.delete(`${routePaths.attendance.build(eventData.data.id)}`);
        },
        onSuccess: async () => {
            await QueryClient.invalidateQueries({
                queryKey: ['event', eventData.data.id],
            });
        },
    });

    const attendEvent = useMutation({
        mutationFn: () => {
            return axios.post(`${routePaths.attendance.build(eventData.data.id)}`);
        },
        onSuccess: async () => {
            await QueryClient.invalidateQueries({
                queryKey: ['event', eventData.data.id],
            });
        },
    });

    return (
        <div id="EpEventAttendanceButtonDialog" popover="auto">
            <div className="EpEventAttendanceButtonDialog-page">
                <div className="EpEventAttendanceButtonDialog-container">
                    <div className="EpEventAttendanceButtonDialog-detailsContainer">
                        <div className="EpEventAttendanceButtonDialog-eventNameContainer">
                            <div className="EpEventAttendanceButtonDialog-iconContainer">
                                <span className="material-symbols-outlined EpEventAttendanceButtonDialog-icon">
                                    confirmation_number
                                </span>
                            </div>
                            <div className="EpEventAttendanceButtonDialog-eventName">Name of the event</div>
                        </div>
                        <div className="EpEventAttendanceButtonDialog-details">
                            <div className="EpEventAttendanceButtonDialog-dateAndPriceTags">
                                <div>Date</div>
                                <div>Price</div>
                            </div>
                            <div className="EpEventAttendanceButtonDialog-dateAndPriceContainer">
                                <div className="EpEventAttendanceButtonDialog-date">Sunday 11th of June</div>
                                <div className="EpEventAttendanceButtonDialog-price">Free</div>
                            </div>
                            <div className="EpEventAttendanceButtonDialog-location">
                                <span className="material-symbols-outlined EpEventAttendanceButtonDialog-eventLocationIcon">
                                    location_on
                                </span>
                                Nottingham, 13 Alfreton Road, NG11 NG1
                            </div>
                        </div>
                    </div>
                    <p className="EpEventAttendanceButtonDialog-terms">
                        By clicking confirm you agree to the event's terms of service. Digital tickets will be sent to
                        your registered email address.
                    </p>
                    <div className="EpEventAttendanceButtonDialog-options">
                        <div className="EpEventAttendanceButtonDialog-buttonContainer">
                            {isUserAttending ? (
                                <EpButton onClick={() => cancelAttendance.mutate()} variant="cancel">
                                    <span className="material-symbols-outlined EpEventAttendanceButtonDialog-cancelIcon">
                                        cancel
                                    </span>
                                    Cancel Attendance
                                </EpButton>
                            ) : (
                                <EpButton onClick={() => attendEvent.mutate()}>
                                    Confirm & Attend
                                    <span className="material-symbols-outlined">arrow_forward</span>
                                </EpButton>
                            )}
                        </div>
                        <div className="EpEventAttendanceButtonDialog-buttonContainer">
                            <EpButton
                                variant="secondary"
                                popoverTarget="EpEventAttendanceButtonDialog"
                                popoverTargetAction="hide"
                            >
                                Go Back
                            </EpButton>
                        </div>
                    </div>
                </div>
                <div className="EpEventAttendanceButtonDialog-cancellationPolicyContainer">
                    <div className="EpEventAttendanceButtonDialog-policyIconContainer">
                        <span className="material-symbols-outlined EpEventAttendanceButtonDialog-policyInfoIcon">
                            info
                        </span>
                    </div>
                    <div className="EpEventAttendanceButtonDialog-policyText">
                        Cancellations made within 24 hours of the event may be subject to a processing fee. By selecting
                        "Cancel Attendance", your spot will be immediately released to the waitlist. This action is
                        irreversible once confirmed.
                    </div>
                </div>
            </div>
        </div>
    );
}
