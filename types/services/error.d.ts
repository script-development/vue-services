import {DefineComponent} from 'vue';

/**
 * The BaseFormError component which can be included in a form
 * It only requires the prop `property` to work
 * When there is an error for the given `property` it will show the form error
 */
export const BaseFormError: DefineComponent<{
    property: {
        type: StringConstructor;
        required: true;
    };
}>;
