export interface Translation {
    readonly singular: String;
    readonly plural: String;
}

export interface TranslatorService {
    private _translations: Object<string, Translation>;
}
