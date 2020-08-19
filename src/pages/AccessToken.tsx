import React from 'react';
import { Redirect } from 'react-router-dom';
import { getAccessToken } from 'utility/api';


function Fuck() {
  let [loading, setLoading] = React.useState(true);

  getAccessToken().then((token) => {
      console.log(token);
      setLoading(false);
  });

  if (loading) return (
      <> </>
  ); else return (
    <Redirect to='/'/>
  );
}

export default Fuck;
