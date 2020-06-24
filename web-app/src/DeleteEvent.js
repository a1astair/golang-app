import React, { useState } from 'react'
import { Form, Header, Icon } from 'semantic-ui-react'
import {apiRoot} from './config'

function DeleteEvent() {
  const [id, setID] = useState('');
  const [invalidForm, setinvalidForm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submitForm = () => {
    if (id) {
      // Submit form to backend
      setLoading(true);
      const Event = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    };
      fetch(`${apiRoot}/events/delete/${id}`, Event)
      .then(async response => {
        const data = await response.json();
        // check for error response
        if (!response.ok) {
          // get error message from body or default to response status
          const error = (data && data.message) || response.status;
          return Promise.reject(error);
        }
        setLoading(false);
        window.location.reload(false);
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
        <Header as='h2'>Delete an Event</Header>
        <Form>
          <Form.Group widths='equal'>
            <Form.Input type='number' fluid label='ID' placeholder='ID' onChange={e => setID(e.target.value)} />
          </Form.Group>
          <Form.Button onClick={submitForm}>Submit</Form.Button>
          {invalidForm && (
            <p>Please Enter an ID!</p>
          )}
          {loading && (
           <Icon name='spinner' />
          )}
          {error && (
           <p>{error}</p>
          )}
        </Form>
      </div>
    );
  }

export default DeleteEvent