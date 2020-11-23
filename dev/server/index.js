import {createServer, Model, Factory} from 'miragejs';
import faker from 'faker';

createServer({
    environment: 'development',

    models: {
        user: Model,
    },

    seeds(server) {
        server.createList('user', 10);
    },

    factories: {
        user: Factory.extend({
            id: i => i + 1,
            name: () => faker.name.findName(),
        }),
    },

    routes() {
        this.namespace = 'api';

        this.get('/users', schema => schema.users.all());
        this.get(
            '/users/:id',
            (schema, request) => {
                const user = schema.users.findBy(request.params);
                user.attrs.comment = 'this is a test';
                return {users: user};
            },
            {timing: 500}
        );
        this.get('/dashboard', schema => schema.users.all());

        // Auth routes
        this.post('/login', schema => {
            return {
                user: schema.users.findBy({id: 1}),
                message: 'Successfully logged in',
            };
        });
        this.post('/logout', () => {});
    },
});
