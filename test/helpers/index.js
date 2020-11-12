/**
 * First this deletes the known entry from cache and then gets it
 * @param {string} serviceName name of the service to acquire
 */
export const newService = serviceName => {
    deleteServiceFromCache(serviceName);
    return require(`../../src/services/${serviceName}`);
};

export const deleteServiceFromCache = serviceName => {
    // deleting the service from cache, so it can load again in another test
    delete require.cache[require.resolve(`../../src/services/${serviceName}`)];
};
