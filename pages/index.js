// pages/index.js
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getPosts } from '../redux/actions/fooActions';
import axios from 'axios';
import Layout from "../components/layout";
import {checkServerSideCookie} from "../redux/actions/authActions";

const Index = ({ foo, custom }) => {
    return (
        <Layout>
            <div>
                // rest of code
            </div>
            <div>Prop from getInitialProps {custom}</div>
        </Layout>
    );
};

Index.getInitialProps = async ({ store, isServer, pathname, query }) => {
    await store.dispatch(getPosts());
    return { custom: 'custom' };
};

export default connect(
    state => state,
    { getPosts }
)(Index);