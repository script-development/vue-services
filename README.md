# vue-services

Documentation: https://script-development.github.io/vue-services/

To work locally run the following command in this directory:

-   npm link

Then run the following command in your project directory:

-   npm link @script-development/vue-services

## Frontend Controller

Vue Services uses Frontend Controllers.
A Controller requires an API Endpoint.

## Component layout

App Component -> Controller Base Component -> Controller Page Component

## Route layout per Controller

        route: plural translation
        component: Base Component
        children:

            page: Overview
            route: ''
            name: plural translation + .overview
            component: Overview Component

            page: Create
            route: '/create'
            name: plural translation + .overview
            component: Create Component

            page: Show
            route: ':id'
            name: plural translation + .show
            component: Show Component

            page: Edit
            route: ':id/edit'
            name: plural translation + .edit
            component: Edit Component

## Function Base Component

For every route the Base Component is also being loaded.
The Base Component calls the read method from the Controller once it is mounted.
This way when you switch from create to overview within the same Controller, the base data is not being loaded again.
