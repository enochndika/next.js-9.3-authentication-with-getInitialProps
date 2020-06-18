import withRedux from "next-redux-wrapper";
import React from 'react'
import { Provider } from 'react-redux'
import { makeStore } from '../redux';
import {checkServerSideCookie} from "../redux/actions/authActions";

const MyApp = ({ Component, pageProps, store }) => {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
};

MyApp.getInitialProps = async ({ Component, ctx }) => {
  // check if user cookie exist
  checkServerSideCookie(ctx);

  ctx.store.dispatch({ type: 'FOO', payload: 'foo' });
  const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};
  return { pageProps };
};

export default withRedux(makeStore)(MyApp);