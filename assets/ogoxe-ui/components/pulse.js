export const vuePulseDirective = {
    mounted($el, { value }) {
        $el.dataset.pulseValue = value
    },
    beforeUpdate($el, { value }) {
        if (!value) {
            return
        }
        let strValue = value.toString()
        if ($el.dataset.pulseValue === strValue) {
            return
        }
        $el.dataset.pulseValue = strValue
        $el.classList.add('pulse')
        setTimeout(() => {
            $el && $el.classList.remove('pulse')
        }, 100)
    }
}
