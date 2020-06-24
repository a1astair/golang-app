import React, { useState, useEffect } from 'react'
import { Card } from 'semantic-ui-react'
import { apiRoot } from './config'
function EventList() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);

  // Note: the empty deps array [] means
  // this useEffect will run once
  // similar to componentDidMount()
  useEffect(() => {
    fetch(`${apiRoot}/events`)
      .then(res => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setItems(result);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
  }, [])

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <Card.Group>
        {items.map(item => (
          <Card fluid key={item.ID}>
            <Card.Content>
              ID: {item.ID}
              <br/>
              Title: <strong>{item.Title}</strong> 
              <br/>
              Description: {item.Description}
            </Card.Content>
          </Card>
        ))}
      </Card.Group>
    );
  }
}

export default EventList