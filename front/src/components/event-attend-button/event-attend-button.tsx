import './event-attend-button.scss';
import { EpButton } from '../button/button.tsx';
import React from 'react';

export function EpEventAttendButton({ children }: React.ComponentPropsWithRef<'button'>) {
    return (
        <div className="EpEventAttendButton-container">
            <EpButton popoverTarget="EpEventAttendButton-confirmation">{children}</EpButton>

            <div id="EpEventAttendButton-confirmation" popover="auto">
                <div className="EpEventAttendButtonDialog-page">
                    <div className="EpEventAttendButtonDialog-container">
                        <div className="EpEventAttendButtonDialog-detailsContainer">
                            <div className="EpEventAttendButtonDialog-details">
                                <div className="EpEventAttendButtonDialog-iconContainer">
                                    <span className="material-symbols-outlined EpEventAttendButtonDialog-icon">
                                        confirmation_number
                                    </span>
                                </div>
                                <div className="EpEventAttendButtonDialog-eventName">Name of the event</div>
                            </div>
                            <div className="EpEventAttendButtonDialog-details">
                                <div>
                                    <div>Date</div>
                                    <div>Saturday, June 22</div>
                                </div>
                                <div>
                                    <div>Price</div>
                                    <div>Free</div>
                                </div>
                            </div>
                        </div>
                        <p className="EpEventAttendButtonDialog-terms">
                            By clicking confirm you agree to the event's terms of service. Digital tickets will be sent
                            to your registered email address.
                        </p>
                        <div className="EpEventAttendButtonDialog-options">
                            <div className="EpEventAttendButtonDialog-buttonContainer">
                                <EpButton>
                                    Confirm & Attend
                                    <span className="material-symbols-outlined">arrow_forward</span>
                                </EpButton>
                            </div>
                            <div className="EpEventAttendButtonDialog-buttonContainer">
                                <EpButton variant="secondary">Cancel & Return</EpButton>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
