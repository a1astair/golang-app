import React, { useState } from 'react'
import { Form, Header, Icon } from 'semantic-ui-react'
import {apiRoot} from './config'

function AddEvent() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [id, setID] = useState('');
  const [invalidForm, setinvalidForm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submitForm = () => {
    if (title && description && id) {
      // Submit form to backend
      setLoading(true);
      const Event = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, title, description })
    };
      fetch(`${apiRoot}/event`, Event)
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
        <Header as='h2'>Add a new Event</Header>
        <Form>
          <Form.Group widths='equal'>
            <Form.Input type='number' fluid label='ID' placeholder='ID' onChange={e => setID(e.target.value)} />
          </Form.Group>
          <Form.Group widths='equal'>
            <Form.Input fluid label='Title' placeholder='Title' onChange={e => setTitle(e.target.value)} />
          </Form.Group>
          <Form.Group widths='equal'>
            <Form.Input fluid label='Description' placeholder='Description' onChange={e => setDescription(e.target.value)} />
          </Form.Group>
          <Form.Button onClick={submitForm}>Submit</Form.Button>
          {invalidForm && (
            <p>Please Enter an ID, Title and a Description!</p>
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

export default AddEvent