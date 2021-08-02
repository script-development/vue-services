/** *
 * @typedef {import('vue').Component} Component
 * @typedef {import('vue-router').NavigationGuard} NavigationGuard
 *
 * @typedef {import('../../../types/types').LoginCredentials} LoginCredentials
 * @typedef {import('../../../types/types').ResetPasswordData} ResetPasswordData
 * @typedef {import('../../../types/types').ResponseErrorMiddleware} ResponseErrorMiddleware
 * @typedef {import('../../../types/types').IsLoggedIn} IsLoggedIn
 * @typedef {import('../../../types/types').LoggedInUser} LoggedInUser
 * @typedef {import('../../../types/types').Item} Item
 */

import LoginPage from '../../pages/auth/Login';
import ResetPasswordPage from '../../pages/auth/ResetPassword';
import {MissingDefaultLoggedinPageError} from '../../errors/MissingDefaultLoggedinPageError';

import {ref} from 'vue';

import {getRequestWithoutCache, postRequest, registerResponseErrorMiddleware} from '../http';
import {addRoute, goToRoute, registerBeforeMiddleware} from '../router';
import {clearStorage, getItemFromStorage, setItemInStorage, setKeepALive} from '../storage';

const LOGIN_ROUTE_NAME = 'Login';
const FORGOT_PASSWORD_ROUTE_NAME = 'ForgotPassword';
const RESET_PASSWORD_ROUTE_NAME = 'ResetPassword';
const SET_PASSWORD_ROUTE_NAME = 'SetPassword';

// TODO :: how to determine the app name?
const APP_NAME = 'Harry';
const IS_LOGGED_IN_KEY = APP_NAME + ' is magical';
const LOGGED_IN_USER_KEY = APP_NAME + ' is supreme';

const apiLoginRoute = '/login';
const apiLogoutRoute = '/logout';
const apiLoggedInCheckRoute = '/me';
const apiSendResetPasswordEmailRoute = '/send-email-reset-password';
const apiResetpasswordRoute = '/resetpassword';

let defaultLoggedInPageName = '';

/** @type {Component} */
let resetPasswordPage = ResetPasswordPage;
/** @type {Component} */
let loginPage = LoginPage;
/** @type {Component} */
let forgotPasswordPage;
/** @type {Component} */
let setPasswordPage;

/** @param {Component} page */
export const setResetPasswordPage = page => (resetPasswordPage = page);
/** @param {Component} page */
export const setLoginPage = page => (loginPage = page);
/** @param {Component} page */
export const setForgotPasswordPage = page => (forgotPasswordPage = page);
/** @param {Component} page */
export const setSetPasswordPage = page => (setPasswordPage = page);

/**
 * Set the default logged in page name
 * @param {string} name
 */
export const setDefaultLoggedInPageName = name => (defaultLoggedInPageName = name);
const goToDefaultLoggedInPage = () => {
    if (!defaultLoggedInPageName) {
        throw new MissingDefaultLoggedinPageError('Please add the default login page to the appStarter');
    }
    goToRoute(defaultLoggedInPageName);
};

export const goToLoginPage = () => goToRoute(LOGIN_ROUTE_NAME);
export const goToResetPasswordPage = () => goToRoute(RESET_PASSWORD_ROUTE_NAME);
export const goToForgotPasswordPage = () => {
    if (!forgotPasswordPage) {
        console.warn('no forgot password page set');
        return;
    }
    goToRoute(FORGOT_PASSWORD_ROUTE_NAME);
};
export const goToSetPasswordPage = () => {
    if (!setPasswordPage) {
        console.warn('no set password page set');
        return;
    }
    goToRoute(SET_PASSWORD_ROUTE_NAME);
};

/** @type {IsLoggedIn} */
export const isLoggedIn = ref(getItemFromStorage(IS_LOGGED_IN_KEY, true) || false);
/** @type {LoggedInUser} */
export const loggedInUser = ref(getItemFromStorage(LOGGED_IN_USER_KEY, true) || {});

// exported for testing purposes, not exported to the user
/** @type {ResponseErrorMiddleware} */
export const responseErrorMiddleware = ({response}) => {
    if (!response) return;
    const {status} = response;
    // TODO :: make this work
    if (status == 403) {
        goToDefaultLoggedInPage();
    } else if (status == 401) {
        // TODO :: if 401 returns, is it really logged out from the server?
        // only need to logout of the app, because on the backend the user is already logged out
        logoutOfApp();
    }
};

registerResponseErrorMiddleware(responseErrorMiddleware);

// TODO :: maybe even add the possibility to add auth middleware here?
// or push it directly to the router?
// exported for testing purposes, not exported to the user
/** @type {NavigationGuard} */
export const beforeMiddleware = ({meta}) => {
    if (!isLoggedIn.value && meta.auth) {
        goToLoginPage();
        return true;
    }

    if (isLoggedIn.value && meta.cantSeeWhenLoggedIn) {
        goToDefaultLoggedInPage();
        return true;
    }

    return false;
};

registerBeforeMiddleware(beforeMiddleware);

/** @param {Item} user */
const setLoggedInAndUser = user => {
    // set the logged in user
    loggedInUser.value = user;
    setItemInStorage(LOGGED_IN_USER_KEY, user);
    // set is logged in
    isLoggedIn.value = true;
    setItemInStorage(IS_LOGGED_IN_KEY, true);
};

const logoutOfApp = () => {
    clearStorage();
    // TODO :: or reload state? transition from this is not rly smooth
    window.location.reload();
};

/**
 *
 * @param {LoginCredentials} credentials
 */
export const login = async credentials => {
    setKeepALive(credentials.rememberMe);
    const response = await postRequest(apiLoginRoute, credentials);

    setLoggedInAndUser(response.data.user);
    goToDefaultLoggedInPage();
    return response;
};

export const logout = async () => {
    const response = await postRequest(apiLogoutRoute, {});

    logoutOfApp();
    return response;
};

export const checkIfLoggedIn = async () => {
    const response = await getRequestWithoutCache(apiLoggedInCheckRoute);

    setLoggedInAndUser(response.data.user);
    return response;
};

/** @param {string} email */
export const sendResetPasswordEmail = async email => {
    const response = await postRequest(apiSendResetPasswordEmailRoute, {email});

    goToLoginPage();
    return response;
};

/** @param {ResetPasswordData} data */
export const resetPassword = async data => {
    const response = await postRequest(apiResetpasswordRoute, data);

    goToLoginPage();
    return response;
};

// TODO :: AuthRoutes really needed? Probably better that the user set's the routes
export const setAuthRoutes = () => {
    addRoute({
        path: '/inloggen',
        name: LOGIN_ROUTE_NAME,
        component: loginPage,
        meta: {auth: false, cantSeeWhenLoggedIn: true, title: 'Login'},
    });

    addRoute({
        path: '/wachtwoord-resetten',
        name: RESET_PASSWORD_ROUTE_NAME,
        component: resetPasswordPage,
        meta: {auth: false, cantSeeWhenLoggedIn: true, title: 'Wachtwoord resetten'},
    });

    if (forgotPasswordPage) {
        addRoute({
            path: '/wachtwoord-resetten',
            name: FORGOT_PASSWORD_ROUTE_NAME,
            component: forgotPasswordPage,
            meta: {auth: false, cantSeeWhenLoggedIn: true, title: 'Wachtwoord vergeten'},
        });
    }

    if (setPasswordPage) {
        addRoute({
            path: '/wachtwoord-setten',
            name: SET_PASSWORD_ROUTE_NAME,
            component: setPasswordPage,
            meta: {auth: false, cantSeeWhenLoggedIn: true, title: 'Wachtwoord setten'},
        });
    }
};
