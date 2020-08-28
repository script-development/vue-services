import assert from 'assert';
import {TranslatorService} from '../../../src/services/translator';

const translatorService = new TranslatorService();

const translations = {
    test: {
        plural: 'tests',
        singular: 'test',
    },
};

describe('test set translation', () => {
    translatorService.setTranslation('test', translations.test);
    it('translatorService should containt test translations', () => {
        assert.deepStrictEqual(translatorService._translations.test, translations.test);
    });
});
