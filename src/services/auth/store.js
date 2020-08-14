const APP_NAME = process.env.MIX_APP_NAME || 'Harry';

const IS_LOGGED_IN = APP_NAME + ' is magical';
const IS_ADMIN = APP_NAME + ' is supreme';
const LOGGED_IN_USER = APP_NAME + ' is Harry';

export default (storageService, httpService, authService) => {
    const storedUser = storageService.getItem(LOGGED_IN_USER);
    return {
        namespaced: true,
        state: {
            isLoggedIn: !!storageService.getItem(IS_LOGGED_IN),
            isAdmin: !!storageService.getItem(IS_ADMIN),
            pending: false,
            loggedInUser: storedUser ? JSON.parse(storedUser) : {},
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
                return httpService.post('/login', payload).then(response => {
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
                return httpService.post('logout').then(response => {
                    commit('LOGOUT');
                    return response;
                });
            },

            logoutApp: ({commit}) => commit('LOGOUT'),

            sendEmailResetPassword: (_, email) => {
                return httpService.post('/sendEmailResetPassword', email).then(response => {
                    if (response.status == 200) authService.goToLoginPage();
                });
            },

            resetPassword: (_, data) => {
                return httpService.post('/resetpassword', data).then(authService.goToLoginPage());
            },

            me: ({commit}) => {
                return httpService.get('me').then(response => {
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
