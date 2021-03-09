/**
 * Set the given value in the storage under the given key
 * If the value is not of type String, it will be converted to String
 */
export function setItemInStorage(key: string, value: any): void;

/**
 * Get the value from the storage under the given key
 * @param {Boolean} [parse] if parse is given, then JSON.parse will be used to return a parsed value
 * @param {any} [defaultValue] the default value, when there is nothing stored
 */
export function getItemFromStorage(key: string, parse: true, defaultValue: number): number;
export function getItemFromStorage(key: string, parse: true, defaultValue: number[]): number[];
export function getItemFromStorage(key: string, parse?: boolean, defaultValue?: any): any;

/** Empty the storage */
export function clearStorage(): void;

export function getKeepALive(): boolean;

export function setKeepALive(value: boolean): void;
