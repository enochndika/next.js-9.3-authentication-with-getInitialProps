import React from "react";
import axios from 'axios';
import { connect } from 'react-redux';
import { reauthenticate, } from '../redux/actions/authActions';
import Layout from '../components/layout';

import jwt from 'jwt-decode';

const Whoami = ({ user }) => (
  <Layout title="Who Am I">
    {(user && (
      <div>
        <h2>Who am i</h2>
        {JSON.stringify(user)}
      </div>
    )) ||
    'Please sign in'}
  </Layout>
);

Whoami.getInitialProps = async ctx => {
  const { token } = ctx.store.getState().authentication;

  // return {
  //   user
  // };

  if (token) {
    const data = jwt(token);
    const response = await axios.get(`http://localhost:8000/api/user/${data._id}`, {
      headers: {
        authorization: `Bearer ${token}`,
        contentType: 'application/json'
      }
    });
    const user = response.data;
    return {
      user
    };
  }
};

export default connect(
  state => state,
  { reauthenticate }
)(Whoami);