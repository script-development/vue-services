import assert from 'assert';
import {deleteServiceFromCache, newService} from '../../helpers';

describe('router serivce', () => {
    after(() => {
        deleteServiceFromCache('router');
        deleteServiceFromCache('router/settings');
        deleteServiceFromCache('translator');
    });

    describe('router settings factory', () => {
        beforeEach(() => {
            const {setTranslation} = newService('translator');
            setTranslation('test', {singular: 'test', plural: 'test'});
        });

        it('should return settings with atleast the base component', () => {
            const factory = newService('router/settings').default;

            const settings = factory('test');
            assert('base' in settings);
        });

        it('should return settings with the create property when create component is passed', () => {
            const factory = newService('router/settings').default;

            const settings = factory('test', {}, undefined, {name: 'create'});
            assert('create' in settings);
        });

        it('should return settings with the create property when overview component is passed', () => {
            const factory = newService('router/settings').default;

            const settings = factory('test', {}, {name: 'overview'});
            assert('overview' in settings);
        });

        it('should return settings with the create property when edit component is passed', () => {
            const factory = newService('router/settings').default;

            const settings = factory('test', {}, undefined, undefined, {name: 'edit'});
            assert('edit' in settings);
        });

        it('should return settings with the create property when show component is passed', () => {
            const factory = newService('router/settings').default;

            const settings = factory('test', {}, undefined, undefined, undefined, {name: 'show'});
            assert('show' in settings);
        });
    });

    describe('router settings partial factory', () => {
        beforeEach(() => {
            const {setTranslation} = newService('translator');
            setTranslation('user', {singular: 'user', plural: 'users'});
        });

        describe('naming convention', () => {
            it('should return the name of a user create partial as user.create', () => {
                const factory = newService('router/settings').partialFactory;

                const partial = factory('user', 'create', {});
                assert.strictEqual(partial.name, 'user.create');
            });

            it('should return the name of a user overview partial as user.overview', () => {
                const factory = newService('router/settings').partialFactory;

                const partial = factory('user', 'overview', {});
                assert.strictEqual(partial.name, 'user.overview');
            });

            it('should return the name of a user show partial as user.show', () => {
                const factory = newService('router/settings').partialFactory;

                const partial = factory('user', 'show', {});
                assert.strictEqual(partial.name, 'user.show');
            });

            it('should return the name of a user edit partial as user.edit', () => {
                const factory = newService('router/settings').partialFactory;

                const partial = factory('user', 'edit', {});
                assert.strictEqual(partial.name, 'user.edit');
            });
        });

        describe('path name convention', () => {
            it('should return the path of a user create partial as toevoegen', () => {
                const factory = newService('router/settings').partialFactory;

                const partial = factory('user', 'create', {});
                assert.strictEqual(partial.path, 'toevoegen');
            });

            it('should return the path of a user overview partial as an empty string', () => {
                const factory = newService('router/settings').partialFactory;

                const partial = factory('user', 'overview', {});
                assert.strictEqual(partial.path, '');
            });

            it('should return the path of a user show partial as :id', () => {
                const factory = newService('router/settings').partialFactory;

                const partial = factory('user', 'show', {});
                assert.strictEqual(partial.path, ':id');
            });

            it('should return the path of a user edit partial as :id/aanpassen', () => {
                const factory = newService('router/settings').partialFactory;

                const partial = factory('user', 'edit', {});
                assert.strictEqual(partial.path, ':id/aanpassen');
            });
        });

        describe('title convention', () => {
            it('should return the title of a user create partial as User aanmaken', () => {
                const factory = newService('router/settings').partialFactory;

                const partial = factory('user', 'create', {});
                assert.strictEqual(partial.meta.title, 'User aanmaken');
            });

            it('should return the title of a user overview partial as Users overzicht', () => {
                const factory = newService('router/settings').partialFactory;

                const partial = factory('user', 'overview', {});
                assert.strictEqual(partial.meta.title, 'Users overzicht');
            });

            it('should return the title of a user show partial as User bekijken', () => {
                const factory = newService('router/settings').partialFactory;

                const partial = factory('user', 'show', {});
                assert.strictEqual(partial.meta.title, 'User bekijken');
            });

            it('should return the title of a user edit partial as User aanpassen', () => {
                const factory = newService('router/settings').partialFactory;

                const partial = factory('user', 'edit', {});
                assert.strictEqual(partial.meta.title, 'User aanpassen');
            });
        });
    });

    // TODO :: find out how to test the router, can't get it to work
    // describe('router before middleware', () => {
    //     before(() => {
    //         // global.document = {querySelector: () => {}};
    //     });
    //     it('should return false when there is no from query present in the route', () => {
    //         const {beforeMiddleware} = newService('router');

    //         const result = beforeMiddleware({}, {query: {}});
    //         assert.strictEqual(result, false);
    //     });
    // });
});
