/**
 * @typedef {import('vue').CreateElement} CreateElement
 * @typedef {import('vue').VNodeChildren} VNodeChildren
 *
 * @typedef {(key:any, item:Object<string,any>) => string} DetailListFormatter
 *
 * @typedef {Object} ListElementEntry
 * @property {string} key The property to show for the list item
 * @property {DetailListFormatter} [formatter] The optional formatter for how to show the list item
 *
 * @typedef {Object} DetailListField
 * @property {string} label The label for the detail list entry
 * @property {string} [key] The property to show for the detail list entry
 * @property {DetailListFormatter} [formatter] The optional formatter for how to show the detail list entry
 * @property {ListElementEntry[]} [unorderedList] Creates an unordered list based on the given entries and shows it as the detail data (dd)
 */

export class DetailListCreator {
    constructor() {
        /** @type {CreateElement} */
        this._h;
    }

    // prettier-ignore
    /** @param {CreateElement} h */
    set h(h) { this._h = h; }

    /**
     * Create a detail list component based on the given fields
     * @param {DetailListField[]} fields The fields for the detail list component
     */
    detailList(fields) {
        const creator = this;
        return {
            functional: true,
            inheritAttrs: false,
            props: {
                item: {
                    type: Object,
                    required: true,
                },
            },
            render(h, {props}) {
                const details = fields.reduce((children, field) => {
                    if (field.unorderedList) {
                        const ulChildren = field.unorderedList.map(listItem => {
                            let keyValue = props.item[listItem.key];
                            if (listItem.formatter) {
                                keyValue = listItem.formatter(props.item[listItem.key], props.item);
                            }
                            return h('li', [keyValue]);
                        });
                        children.push(creator.dt(field.label), creator.dd([h('ul', ulChildren)]));
                        return children;
                    }

                    let keyValue = props.item[field.key];
                    if (field.formatter) {
                        keyValue = field.formatter(props.item[field.key], props.item);
                    }

                    children.push(creator.dt(field.label), creator.dd(keyValue));
                    return children;
                }, []);

                return creator.dl(details);
            },
        };
    }

    /** @param {String} label */
    dt(label) {
        return this._h('dt', {class: 'col-sm-3'}, label);
    }

    /** @param {VNodeChildren} children */
    dd(children) {
        return this._h('dd', {class: 'col-sm-9'}, children);
    }

    /** @param {VNodeChildren} children */
    dl(children) {
        return this._h('dl', {class: 'row'}, children);
    }
}
