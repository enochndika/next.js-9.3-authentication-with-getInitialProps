// actions/authActions.js
import Router from "next/router";
import cookie from 'js-cookie';
import { AUTHENTICATE, DEAUTHENTICATE } from '../actionTypes';

export const authenticate = user => dispatch =>
    fetch(`https://aqueous-meadow-07678.herokuapp.com/api/login`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
        .then(data => data.json())
        .then(response => {
            // console.log('ok set cookie', response.token);
            setCookie('token', response.token);
            Router.push('/')
            dispatch({ type: AUTHENTICATE, payload: response.token });
        })
        .catch(err => console.log(err));


// gets the token from the cookie and saves it in the store
export const reauthenticate = token => {
    return dispatch => {
        dispatch({ type: AUTHENTICATE, payload: token });
    };
};

// removing the token
export const deauthenticate = () => {
    return dispatch => {
        removeCookie('token');
        Router.push('/');
        dispatch({ type: DEAUTHENTICATE });
    };
};

export const checkServerSideCookie = ctx => {
    if (ctx.isServer) {
        if (ctx.req.headers.cookie) {
            const token = getCookie('token', ctx.req);
            ctx.store.dispatch(reauthenticate(token));
        }
    } else {
        const token = ctx.store.getState().authentication.token;

        if (token && (ctx.pathname === '/signin' || ctx.pathname === '/signup')) {
            setTimeout(function() {
                Router.push('/');
            }, 0);
        }
    }
};
/**
 * cookie helper methods
 */

export const setCookie = (key, value) => {
    if (process.browser) {
        cookie.set(key, value, {
            expires: 1,
            path: '/'
        });
    }
};

export const removeCookie = key => {
    if (process.browser) {
        cookie.remove(key, {
            expires: 1
        });
    }
};

export const getCookie = (key, req) => {
    return process.browser ? getCookieFromBrowser(key) : getCookieFromServer(key, req);
};

const getCookieFromBrowser = key => {
    return cookie.get(key);
};

const getCookieFromServer = (key, req) => {
    if (!req.headers.cookie) {
        return undefined;
    }
    const rawCookie = req.headers.cookie.split(';').find(c => c.trim().startsWith(`${key}=`));
    if (!rawCookie) {
        return undefined;
    }
    return rawCookie.split('=')[1];
};