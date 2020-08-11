import React, { useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import Header from 'components/Header';
import Footer from 'components/Footer';
import { logout } from 'utility/api';
import { useDispatch } from 'react-redux';
import { UserAction } from 'actions';
import { Dispatch } from 'redux';

interface LogoutProps {}

function Logout({}: LogoutProps) {
  let [status, setStatus] = React.useState(0);
  let dispatch = useDispatch<Dispatch<UserAction>>();

  useEffect(() => {
    logout();
    setStatus(1);
  }, []);

  if (status) return <Redirect to="/" />;
  else
    return (
      <>
        <Header />
        <Footer />
      </>
    );
}

export default Logout;
