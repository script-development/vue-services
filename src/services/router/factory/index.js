/**
 * @typedef {import('../settings').RouteSettings} RouteSettings
 * @typedef {import('vue-router').RouteConfig} RouteConfig
 */

export class RouteFactory {
    /**
     * Create the base for the routes based on the settings and add the children to it
     *
     * @param {RouteSettings} settings the settings for which the route is being created
     * @param {RouteConfig[]} children
     *
     * @returns {RouteConfig}
     */
    createBase(settings, children) {
        return {
            path: settings.basePath,
            component: settings.baseComponent,
            children,
        };
    }

    /**
     * Create a standard route config
     *
     * @param {String} path the name of the path for the route config
     * @param {String} name the name of the route
     * @param {*} component the component to render for this route
     * @param {Boolean} auth if you need to be authenticated to see this route
     * @param {Boolean} admin if you need to be admin to see the route
     * @param {String} title the title of the route
     *
     * @returns {RouteConfig}
     */
    createConfig(path, name, component, auth, admin, title) {
        return {
            path,
            name,
            component,
            meta: {auth, admin, title},
        };
    }

    /**
     * Create an overview route for the given settings
     *
     * @param {RouteSettings} settings the settings for which the route is being created
     *
     * @returns {RouteConfig}
     */
    createOverview(settings) {
        return this.createConfig(
            settings.overviewPath,
            settings.overviewName,
            settings.overviewComponent,
            settings.overviewPageAuthOnly,
            settings.overviewPageAdminOnly,
            settings.overviewTitle
        );
    }

    /**
     * Create a create route for the given settings
     *
     * @param {RouteSettings} settings the settings for which the route is being created
     *
     * @returns {RouteConfig}
     */
    createCreate(settings) {
        return this.createConfig(
            settings.createPath,
            settings.createName,
            settings.createComponent,
            settings.createPageAuthOnly,
            settings.createPageAdminOnly,
            settings.createTitle
        );
    }

    /**
     * Create a create route for the given settings
     *
     * @param {RouteSettings} settings the settings for which the route is being created
     *
     * @returns {RouteConfig}
     */
    createShow(settings) {
        return this.createConfig(
            settings.showPath,
            settings.showName,
            settings.showComponent,
            settings.showPageAuthOnly,
            settings.showPageAdminOnly,
            settings.showTitle
        );
    }

    /**
     * Create a create route for the given settings
     *
     * @param {RouteSettings} settings the settings for which the route is being created
     *
     * @returns {RouteConfig}
     */
    createEdit(settings) {
        return this.createConfig(
            settings.editPath,
            settings.editName,
            settings.editComponent,
            settings.editPageAuthOnly,
            settings.editPageAdminOnly,
            settings.editTitle
        );
    }
}