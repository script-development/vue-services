import {createServer, Model} from 'miragejs';

createServer({
    environment: 'development',

    models: {
        user: Model,
    },

    seeds(server) {
        server.create('user', {id: 1, name: 'Bob'});
        server.create('user', {id: 2, name: 'Alice'});
    },

    routes() {
        this.namespace = 'api';

        this.get('/users', schema => {
            return schema.users.all();
        });
    },
});
