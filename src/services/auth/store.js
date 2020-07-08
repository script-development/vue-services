const IS_LOGGED_IN = 'Leerlab Academie logged in';
const IS_ADMIN = 'Leerlab Academie admin';

export default (storageService, httpService, authService) => ({
    namespaced: true,
    state: {
        isLoggedIn: !!storageService.getItem(IS_LOGGED_IN),
        isAdmin: !!storageService.getItem(IS_ADMIN),
        pending: false,
        // userToRegister: {}, // move to register service
    },
    getters: {
        isLoggedIn: state => state.isLoggedIn,
        isAdmin: state => state.isAdmin,
        // getUserToRegister: state => state.userToRegister,// move to register service
    },
    mutations: {
        LOGIN: state => (state.pending = true),
        LOGIN_SUCCES: (state, isAdmin) => {
            state.pending = false;
            state.isLoggedIn = true;
            storageService.setItem(IS_LOGGED_IN, state.isLoggedIn);
            if (isAdmin) {
                state.isAdmin = isAdmin;
                storageService.setItem(IS_ADMIN, isAdmin);
            } else {
                state.isAdmin = false;
            }
        },
        LOGOUT: _ => {
            storageService.clear();
            // TODO :: or reload state? transition from this is not rly smooth
            window.location.reload(false);
        },
        // SET_USER_TO_REGISTER: (state, payload) => (state.userToRegister = payload),// move to register service
    },
    actions: {
        login: ({commit}, payload) => {
            storageService.keepALive = payload.rememberMe;
            commit('LOGIN');
            return httpService.post('/login', payload).then(response => {
                const isAdmin = response.data.isAdmin;
                commit('LOGIN_SUCCES', isAdmin);
                return isAdmin;
            });
        },
        logout: ({commit}) => commit('LOGOUT'),

        sendEmailResetPassword: (_, email) => {
            return httpService.post('/sendEmailResetPassword', email).then(response => {
                if (response.status == 200) authService.goToLoginPage();
            });
        },
        resetPassword: (_, data) => {
            return httpService.post('/resetpassword', data).then(authService.goToLoginPage());
        },
    },
});
