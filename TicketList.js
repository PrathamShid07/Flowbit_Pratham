// src/components/TicketList.js
import React from 'react';
import TicketItem from './TicketItem';

const TicketList = ({ tickets }) => {
  return (
    <div>
      <h2>All Tickets</h2>
      {tickets.length === 0 ? (
        <p>No tickets available.</p>
      ) : (
        tickets.map((ticket, index) => (
          <TicketItem key={index} ticket={ticket} />
        ))
      )}
    </div>
  );
};

export default TicketList;