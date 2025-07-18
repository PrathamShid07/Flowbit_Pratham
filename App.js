// src/App.js
import React, { useState } from 'react';
import TicketList from './components/TicketList';
import CreateTicket from './components/CreateTicket';

const App = () => {
  const [tickets, setTickets] = useState([]);

  const handleCreate = (ticket) => {
    setTickets([...tickets, ticket]);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Support Tickets</h1>
      <CreateTicket onCreate={handleCreate} />
      <TicketList tickets={tickets} />
    </div>
  );
};

export default App;