// Component File
import App from './App';

// it's here to init the controllers, so it registers all routes and store modules
import * as controllers from './controllers';
import {appStarter} from '@script-development/vue-services';
import LoginPage from './pages/auth/Login';
import {STATIC_DATA} from './constants/staticdata';

appStarter.start(App, 'dashboard.overview', LoginPage, controllers, STATIC_DATA);
