import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Typography } from 'antd';

const { Title } = Typography;

const Home = () => {
  const [message, setMessage] = useState(null);
  /* const [isFetching, setIsFetching] = useState(false);
  const [url, setUrl] = useState('/Test');

  const fetchData = useCallback(() => {
    fetch('/test')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`status ${response.status}`);
        }
        return response.json();
      })
      .then((json) => {
        setMessage(json.message);
        setIsFetching(false);
      })
      .catch((e) => {
        setMessage(`API call failed: ${e}`);
        setIsFetching(false);
      });
  }, [url]);

  useEffect(() => {
    setIsFetching(true);
    fetchData();
  }, [fetchData]); */

  async function postData(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json',
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }

  return (
    <div>
      <Title style={{ alignItems: 'center' }}>Startseite</Title>
      <Title level={3}>Das ist unsere Startseite - TOLL!</Title>
      {/* <p>{isFetching ? 'Fetching message from API' : message}</p> */}
      <p>{message}</p>
      <Link to='/modeler'>
        <Button type='primary'>Go to Modeler</Button>
      </Link>
    </div>
  );
};

export default Home;
