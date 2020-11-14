import {Translation} from '../types';

/**
 * Get the plural translation for the given moduleName
 *
 * @throws {MissingTranslationError}
 */
export declare function getPluralTranslation(moduleName: string): string;

/**
 * Get the plural translation for the given moduleName and capitalize it
 *
 * @throws {MissingTranslationError}
 */
export declare function getCapitalizedPluralTranslation(moduleName: string): string;

/**
 * Get the singular translation for the given moduleName
 *
 * @throws {MissingTranslationError}
 */
export declare function getSingularTranslation(moduleName: string): string;

/**
 * Get the singular translation for the given moduleName and capitalize it
 *
 * @throws {MissingTranslationError}
 */
export declare function getCapitalizedSingularTranslation(moduleName: string): string;

/**
 * Get the either the singular or plural translation, based on the given count
 * Return the string `${count} ${translation}`
 *
 * @throws {MissingTranslationError}
 */
export declare function maybePluralize(count: number, moduleName: string): string;

export declare function setTranslation(moduleName: string, translation: Translation): void;
