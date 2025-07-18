// src/components/TicketItem.js
import React from 'react';

const TicketItem = ({ ticket }) => {
  return (
    <div style={{ border: '1px solid #ccc', marginBottom: '1rem', padding: '1rem' }}>
      <h3>{ticket.title}</h3>
      <p>{ticket.description}</p>
    </div>
  );
};

export default TicketItem;
