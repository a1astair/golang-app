import React from 'react';
import PageHeader from "./pageHeader"
import EventList from "./EventList"
import AddEvent from "./AddEvent"
import GetOneEvent from "./GetOneEvent"
import UpdateEvent from "./UpdateEvent"
import DeleteEvent from "./DeleteEvent"
import { Container, Divider, Segment, Grid } from 'semantic-ui-react';
function App() {
  return (
    <Container>
      <Divider hidden />
      <PageHeader />
      <Segment padded>
        <Divider hidden />
        <Grid columns={2} relaxed='very' stackable>
          <Grid.Column>
            <EventList />
          </Grid.Column>
          {/* <Divider vertical /> */}
          <Grid.Column>
            <GetOneEvent />
          </Grid.Column>
        </Grid>
      </Segment>
      <Divider hidden />
      <Segment padded>
      <Divider hidden />
        <Grid columns={2} relaxed='very' stackable>
          <Grid.Column>
            <AddEvent />
          </Grid.Column>
          {/* <Divider vertical /> */}
          <Grid.Column>
            <UpdateEvent />
          </Grid.Column>
        </Grid>
      </Segment>
      <Divider hidden />
      <Segment padded>
      <DeleteEvent />
      </Segment>
    </Container>
  );
}

export default App;
