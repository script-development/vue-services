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
            const translationKey = 'does not exist';
            assert.throws(
                () => translatorService.getSingular(translationKey),
                error => {
                    assert(error instanceof MissingTranslationError);
                    assert.equal(error.message, `Missing translation for ${translationKey}`);
                    return true;
                }
            );
        });
    });

    describe('Test missing plural translation', () => {
        const translationKey = 'noPlural';
        translatorService.setTranslation(translationKey, {singular: translationKey});

        it('translatorService should throw a MissingTranslationError when getting a missing plural translation', () => {
            assert.throws(
                () => translatorService.getPlural(translationKey),
                error => {
                    assert(error instanceof MissingTranslationError);
                    assert.equal(error.message, `Missing plural translation for ${translationKey}`);
                    return true;
                }
            );
        });
    });

    describe('Test missing singular translation', () => {
        const translationKey = 'noSingular';
        translatorService.setTranslation(translationKey, {plural: translationKey});
        // TODO :: should test the error message as well
        it('translatorService should throw a MissingTranslationError when getting a missing singular translation', () => {
            assert.throws(
                () => translatorService.getSingular(translationKey),
                error => {
                    assert(error instanceof MissingTranslationError);
                    assert.equal(error.message, `Missing singular translation for ${translationKey}`);
                    return true;
                }
            );
        });
    });
});
