import './_index.scss'

import buttonHtml from './button.html'
import checkboxRadioHtml from './checkbox-radio.html'
import fileHtml from './file.html'
import groupHtml from './group.html'
import iconHtml from './icon.html'
import inputRangeCustomHtml from './input-range-custom/index.html'
import { InputRangeCustom } from './input-range-custom/index.js'
import layoutHtml from './layout.html'
import selectCustomHtml from './select-custom.html'
import SelectCustom from '~/ui/form/SelectCustom'
import textTextareaSelectHtml from './text-textarea-select.html'
import toggleHtml from './toggle.html'

export default {
    title: 'UiKit/Formulaires'
}

export const Button = () => ({ template: buttonHtml })
export const CheckboxRadio = () => ({ template: checkboxRadioHtml })
export const File = () => ({ template: fileHtml })
export const Group = () => ({ template: groupHtml })
export const Icon = () => ({ template: iconHtml })
export const Layout = () => ({ template: layoutHtml })

export const Range = () => ({
    data: () => {
        return {
            instances: []
        }
    },
    template: inputRangeCustomHtml,
    mounted() {
        document.querySelectorAll('input[data-custom-range]').forEach((elt) => {
            this.instances.push(new InputRangeCustom(elt))
        })
    },
    unmounted() {
        this.instances.forEach((instance) => {
            instance.destroy()
        })
        this.instances = []
    }
})

export const Select = () => ({
    data: () => {
        return {
            instances: []
        }
    },
    template: selectCustomHtml,
    mounted() {
        document.querySelectorAll('select[data-select-custom]').forEach((elt) => {
            this.instances.push(new SelectCustom(elt))
        })
    },
    unmounted() {
        this.instances.forEach((instance) => {
            instance.destroy()
        })
        this.instances = []
    }
})

export const TextTextarea = () => ({ template: textTextareaSelectHtml })
export const Toggle = () => ({ template: toggleHtml })
