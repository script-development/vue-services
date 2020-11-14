import assert from 'assert';
import {MissingTranslationError} from '../../../src/errors/MissingTranslationError';
import {deleteServiceFromCache, newService} from '../../helpers';

const {strictEqual} = assert;

describe('Translator Service', () => {
    after(() => deleteServiceFromCache('translator'));

    describe('test translation getters', () => {
        const {
            setTranslation,
            getPluralTranslation,
            getCapitalizedSingularTranslation,
            getSingularTranslation,
            getCapitalizedPluralTranslation,
            maybePluralize,
        } = newService('translator');
        setTranslation('company', {singular: 'bedrijf', plural: 'bedrijven'});

        it('should get plural test translation', () => {
            strictEqual(getPluralTranslation('company'), 'bedrijven');
        });

        it('should get capitalized plural test translation', () => {
            strictEqual(getCapitalizedPluralTranslation('company'), 'Bedrijven');
        });

        it('should get singular test translation', () => {
            strictEqual(getSingularTranslation('company'), 'bedrijf');
        });

        it('should get capitalized singular test translation', () => {
            strictEqual(getCapitalizedSingularTranslation('company'), 'Bedrijf');
        });

        it('should pluralize test translation when the count is bigger then 1', () => {
            strictEqual(maybePluralize(2, 'company'), '2 bedrijven');
        });

        it('should singularize test translation when the count is 1', () => {
            strictEqual(maybePluralize(1, 'company'), '1 bedrijf');
        });

        it('should pluralize test translation when the count is 0', () => {
            strictEqual(maybePluralize(0, 'company'), '0 bedrijven');
        });
    });

    describe('none existing translation', () => {
        it('should throw a MissingTranslationError when getting a none existing translation', () => {
            const {getSingularTranslation} = newService('translator');
            const translationKey = 'does not exist';
            assert.throws(
                () => getSingularTranslation(translationKey),
                error => {
                    assert(error instanceof MissingTranslationError);
                    strictEqual(error.message, `Missing translation for ${translationKey}`);
                    strictEqual(error.name, 'MissingTranslationError');
                    return true;
                }
            );
        });
    });

    describe('missing plural translation', () => {
        const {getPluralTranslation, setTranslation} = newService('translator');
        const translationKey = 'noPlural';
        setTranslation(translationKey, {singular: translationKey});

        it('should throw a MissingTranslationError when getting a missing plural translation', () => {
            assert.throws(
                () => getPluralTranslation(translationKey),
                error => {
                    assert(error instanceof MissingTranslationError);
                    strictEqual(error.message, `Missing plural translation for ${translationKey}`);
                    strictEqual(error.name, 'MissingTranslationError');
                    return true;
                }
            );
        });
    });

    describe('missing singular translation', () => {
        const {getSingularTranslation, setTranslation} = newService('translator');
        const translationKey = 'noSingular';
        setTranslation(translationKey, {plural: translationKey});
        it('should throw a MissingTranslationError when getting a missing singular translation', () => {
            assert.throws(
                () => getSingularTranslation(translationKey),
                error => {
                    assert(error instanceof MissingTranslationError);
                    strictEqual(error.message, `Missing singular translation for ${translationKey}`);
                    strictEqual(error.name, 'MissingTranslationError');
                    return true;
                }
            );
        });
    });
});
