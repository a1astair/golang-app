import React, { useState } from 'react'
import { Form, Header, Icon } from 'semantic-ui-react'
import {apiRoot} from './config'

function GetOneEvent() {
  const [id, setID] = useState('');
  const [invalidForm, setinvalidForm] = useState(false);
  const [error, setError] = useState('');
  const [event, setEvent] = useState('');
  const [loading, setLoading] = useState(false);

  const submitForm = () => {
    if (id) {
      setEvent('');
      // Submit form to backend
      setLoading(true);
      const Event = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    };
      fetch(`${apiRoot}/events/${id}`, Event)
      .then(async response => {
        const responseData = await response.json();
        // check for error response
        if (!response.ok) {
          // get error message from body or default to response status
          const error = (responseData && responseData.message) || response.status;
          return Promise.reject(error);
        }
        setEvent(responseData);
        setLoading(false);
        
      })
      .catch(error => {
        setLoading(false);
        setError(error.toString());
        setTimeout(() => {
          setError('')
        }, 2000)
      });
    } else {
      setinvalidForm(true);
      setTimeout(() => {
        setinvalidForm(false)
      }, 2000)
    }
  }
    return (
      <div>
        <Header as='h2'>Get one Eventt</Header>
        <Form>
          <Form.Group widths='equal'>
            <Form.Input type='number' fluid label='ID' placeholder='ID' onChange={e => setID(e.target.value)} />
          </Form.Group>
          <Form.Button onClick={submitForm}>Submit</Form.Button>
          {invalidForm && (
            <p>Please Enter an ID</p>
          )}
          {loading && (
           <Icon name='spinner' />
          )}
          {error && (
           <p>{error}</p>
          )}
          {event && (
            <div>
            <h3>Event Info!</h3>
            <p>{event.ID}</p>
            <p>{event.Title}</p>
            <p>{event.Description}</p>
            </div>
            )}
        </Form>
      </div>
    );
  }

export default GetOneEvent