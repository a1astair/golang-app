import React from 'react';
import PageHeader from "./pageHeader"
import EventList from "./EventList"
import AddEvent from "./AddEvent"
import GetOneEvent from "./GetOneEvent"
import UpdateEvent from "./UpdateEvent"
import DeleteEvent from "./DeleteEvent"
import { Container } from 'semantic-ui-react';
function App() {
  return (
    <Container>
      <br/>
      <PageHeader/>
      <EventList/>
      <br/>
      <AddEvent/>
      <br/>
      <GetOneEvent/>
      <br/>
      <UpdateEvent/>
      <br/>
      <DeleteEvent/>
    </Container>
  );
}

export default App;
