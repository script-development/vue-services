import assert from 'assert';
import {TranslatorService} from '../../../src/services/translator';
import {MissingTranslationError} from '../../../src/errors/MissingTranslationError';

const translations = {
    test: {
        plural: 'tests',
        singular: 'test',
    },
};

describe('Translator Service', () => {
    const translatorService = new TranslatorService();

    describe('Add new test translation', () => {
        translatorService.setTranslation('test', translations.test);

        it('translatorService should contain test translations', () => {
            assert.deepStrictEqual(translatorService._translations.test, translations.test);
        });

        it('translatorService should get plural test translation', () => {
            assert.equal(translatorService.getPlural('test'), 'tests');
        });

        it('translatorService should get capitalized plural test translation', () => {
            assert.equal(translatorService.getCapitalizedPlural('test'), 'Tests');
        });

        it('translatorService should get singular test translation', () => {
            assert.equal(translatorService.getSingular('test'), 'test');
        });

        it('translatorService should get capitalized singular test translation', () => {
            assert.equal(translatorService.getCapitalizedSingular('test'), 'Test');
        });

        it('translatorService should pluralize test translation when the count is bigger then 1', () => {
            assert.equal(translatorService.maybePluralize(2, 'test'), '2 tests');
        });

        it('translatorService should singularize test translation when the count is 1', () => {
            assert.equal(translatorService.maybePluralize(1, 'test'), '1 test');
        });

        it('translatorService should pluralize test translation when the count 0', () => {
            assert.equal(translatorService.maybePluralize(0, 'test'), '0 tests');
        });
    });

    describe('Test none existing translation', () => {
        it('translatorService should throw a MissingTranslationError when getting a none existing translation', () => {
            assert.throws(() => translatorService.getSingular('does not exist'), MissingTranslationError);
        });
    });
});
