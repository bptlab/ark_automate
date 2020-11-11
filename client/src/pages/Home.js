import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Typography } from 'antd';

const { Title } = Typography;

const Home = () => {
  const [message, setMessage] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
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
  }, [fetchData]);

  return (
    <div>
      <Title style={{ alignItems: 'center' }}>Startseite</Title>
      <Title level={3}>Das ist unsere Startseite - GEIL!</Title>
      <p>{isFetching ? 'Fetching message from API' : message}</p>
      <Link to='/modeler'>
        <Button type='primary'>Go to Modeler</Button>
      </Link>
    </div>
  );
};

export default Home;
