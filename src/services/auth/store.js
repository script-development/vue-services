const APP_NAME = process.env.MIX_APP_NAME || 'Harry';

const IS_LOGGED_IN = APP_NAME + ' is magical';
const IS_ADMIN = APP_NAME + ' is supreme';
const LOGGED_IN_USER = APP_NAME + ' is Harry';

export default (storageService, httpService, authService) => {
    return {
        namespaced: true,
        state: {
            isLoggedIn: !!storageService.getItem(IS_LOGGED_IN),
            isAdmin: !!storageService.getItem(IS_ADMIN),
            pending: false,
            loggedInUser: storageService.getItem(LOGGED_IN_USER, true) || {},
            // userToRegister: {}, // move to register service
        },
        getters: {
            isLoggedIn: state => state.isLoggedIn,
            isAdmin: state => state.isAdmin,
            loggedInUser: state => state.loggedInUser,
            // getUserToRegister: state => state.userToRegister,// move to register service
        },
        mutations: {
            LOGIN: state => (state.pending = true),
            LOGIN_SUCCES: state => {
                state.pending = false;
                state.isLoggedIn = true;
                storageService.setItem(IS_LOGGED_IN, state.isLoggedIn);
            },
            LOGOUT: _ => {
                storageService.clear();
                // TODO :: or reload state? transition from this is not rly smooth
                window.location.reload(false);
            },
            SET_ADMIN: (state, isAdmin) => {
                state.isAdmin = isAdmin;
                storageService.setItem(IS_ADMIN, isAdmin);
            },
            SET_LOGGED_IN_USER: (state, user) => {
                state.loggedInUser = user;
                storageService.setItem(LOGGED_IN_USER, JSON.stringify(user));
            },
            // SET_USER_TO_REGISTER: (state, payload) => (state.userToRegister = payload),// move to register service
        },
        actions: {
            login: ({commit}, payload) => {
                storageService.keepALive = payload.rememberMe;
                commit('LOGIN');
                return httpService.post(authService.apiLoginRoute, payload).then(response => {
                    commit('LOGIN_SUCCES');
                    const user = response.data.user;
                    if (user) commit('SET_LOGGED_IN_USER', user);
                    const isAdmin = response.data.isAdmin;
                    // After login admin can never be set to false
                    if (isAdmin) commit('SET_ADMIN', isAdmin);
                    return response;
                });
            },
            logout: ({commit}) => {
                return httpService.post(authService.apiLogoutRoute).then(response => {
                    commit('LOGOUT');
                    return response;
                });
            },

            logoutApp: ({commit}) => commit('LOGOUT'),

            sendEmailResetPassword: (_, email) => {
                return httpService.post(authService.apiSendEmailResetPasswordRoute, {email}).then(response => {
                    if (response.status == 200) authService.goToLoginPage();
                });
            },

            resetPassword: (_, data) => {
                return httpService
                    .post(authService.apiResetpasswordRoute, data)
                    .then(() => authService.goToLoginPage());
            },

            me: ({commit}) => {
                return httpService.get(authService.apiLoggedInCheckRoute).then(response => {
                    const user = response.data.user;
                    if (user) commit('SET_LOGGED_IN_USER', user);
                    const isAdmin = response.data.isAdmin;
                    // After login admin can never be set to false
                    if (isAdmin) commit('SET_ADMIN', isAdmin);
                    return response;
                });
            },
        },
    };
};
