import React from "react";
import "./TicketNav.css";

export default function TicketNav() {
    return (
        <div className="scs-ticket-nav">
            <div className="ticketNav ticketNavMobile">
                <a className="sqs-button-element--tertiary" href="#ga-tix">
                    <span className="material-symbols-outlined">
                        groups
                    </span>
                    <span className="ticketNavLabel">GA</span>
                </a>
                <a className="sqs-button-element--tertiary" href="#premium-tix">
                    <span className="material-symbols-outlined">
                        local_activity
                    </span>
                    <span className="ticketNavLabel">  Premium</span>
                </a>
                <a className="sqs-button-element--tertiary" href="#stm-tix">
                    <span className="material-symbols-outlined">
                        star_shine
                    </span>
                    <span className="ticketNavLabel"> STM</span>
                </a>
                <a className="sqs-button-element--tertiary" href="#private">
                    <span className="material-symbols-outlined">
                        group
                    </span>
                    <span className="ticketNavLabel">groups</span>
                </a>
                 <a className="sqs-button-element--tertiary" href="#parking">
                    <span className="material-symbols-outlined">
                        directions_car
                    </span>
                    <span className="ticketNavLabel">parking</span>
                </a>
            </div>


        </div>
    );
}
