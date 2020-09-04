import assert from 'assert';
import {TranslatorService} from '../../../src/services/translator';
import {MissingTranslationError} from '../../../src/errors/MissingTranslationError';

const translations = {
    company: {
        plural: 'bedrijven',
        singular: 'bedrijf',
    },
};

describe('Translator Service', () => {
    const translatorService = new TranslatorService();

    describe('Add new test translation', () => {
        translatorService.setTranslation('company', translations.company);

        it('translatorService should get plural test translation', () => {
            assert.equal(translatorService.getPlural('company'), 'bedrijven');
        });

        it('translatorService should get capitalized plural test translation', () => {
            assert.equal(translatorService.getCapitalizedPlural('company'), 'Bedrijven');
        });

        it('translatorService should get singular test translation', () => {
            assert.equal(translatorService.getSingular('company'), 'bedrijf');
        });

        it('translatorService should get capitalized singular test translation', () => {
            assert.equal(translatorService.getCapitalizedSingular('company'), 'Bedrijf');
        });

        it('translatorService should pluralize test translation when the count is bigger then 1', () => {
            assert.equal(translatorService.maybePluralize(2, 'company'), '2 bedrijven');
        });

        it('translatorService should singularize test translation when the count is 1', () => {
            assert.equal(translatorService.maybePluralize(1, 'company'), '1 bedrijf');
        });

        it('translatorService should pluralize test translation when the count is 0', () => {
            assert.equal(translatorService.maybePluralize(0, 'company'), '0 bedrijven');
        });
    });

    describe('Test none existing translation', () => {
        it('translatorService should throw a MissingTranslationError when getting a none existing translation', () => {
            assert.throws(() => translatorService.getSingular('does not exist'), MissingTranslationError);
        });
    });

    describe('Test missing plural translation', () => {
        translatorService.setTranslation('noPlural', {singular: 'noPlural'});
        it('translatorService should throw a MissingTranslationError when getting a missing plural translation', () => {
            assert.throws(() => translatorService.getPlural('noPlural'), MissingTranslationError);
        });
    });

    describe('Test missing singular translation', () => {
        translatorService.setTranslation('noSingular', {plural: 'noSingular'});
        it('translatorService should throw a MissingTranslationError when getting a missing singular translation', () => {
            assert.throws(() => translatorService.getSingular('noSingular'), MissingTranslationError);
        });
    });
});
