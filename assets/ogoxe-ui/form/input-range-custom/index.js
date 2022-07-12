import EventEmitter from '~/lib/EventEmitter'

function removeChildren($elt) {
    while ($elt.firstChild) {
        $elt.firstChild.remove()
    }
}

export const vueInputRangeDirective = {
    mounted($el, { value }) {
        let options = {}
        if (value) {
            options.valuesByTick = value
        }
        new InputRangeCustom($el, options)
    },
    unmounted($el) {
        if ($el._input_range_custom) {
            $el._input_range_custom.destroy()
            $el._input_range_custom = null
        }
    }
}

/* si data contient des horodages vides compléter avec la dernière image */

export class InputRangeCustom extends EventEmitter {
    constructor(inputSelector, options = {}) {
        super()

        this._$input =
            typeof containerSelector === 'string'
                ? document.querySelector(inputSelector)
                : inputSelector

        this.options = Object.assign({}, InputRangeCustom.defaultOptions, options)

        this._range = parseInt(this._$input.max) - parseInt(this._$input.min)

        this._buildComponent()

        this._onInput = this._onInput.bind(this)
        this._$input.addEventListener('input', this._onInput)

        this._onInput()

        this._$input._rangeCustom = this
    }

    destroy() {
        this._$input.removeEventListener('input', this._onInput)
    }

    update() {
        this._range = parseInt(this._$input.max) - parseInt(this._$input.min)
        this._setTicks()
    }

    _buildComponent() {
        const wrapper = document.createElement('div')
        wrapper.className = this._$input.className

        wrapper.classList.add('ogoxe-input-range-custom')
        if (this.options.className) {
            wrapper.classList.add(this.options.className)
        }
        const trackContainer = document.createElement('div')
        trackContainer.classList.add('track-container')

        const trackElement = document.createElement('div')
        trackElement.classList.add('track-element')

        const track = document.createElement('div')
        track.classList.add('track')

        this._$trackProgress = document.createElement('div')
        this._$trackProgress.classList.add('track-progress')

        this._$trackTicks = document.createElement('div')
        this._$trackTicks.classList.add('track-ticks')
        this._setTicks()

        trackElement.append(track, this._$trackProgress, this._$trackTicks)
        trackContainer.append(trackElement)

        this._$input.replaceWith(wrapper)
        wrapper.append(trackContainer)
        wrapper.append(this._$input)
    }

    _setTicks() {
        let trackTicks = this._$trackTicks
        removeChildren(trackTicks)
        let valuesByTick = this.options.valuesByTick || parseInt(this._$input.step) || 1
        const tickCount = this._range / valuesByTick + 1

        for (let i = 0; i < tickCount; i++) {
            let tick = document.createElement('span')
            tick.className = 'track-tick'
            trackTicks.appendChild(tick)
        }
    }
    _onInput() {
        setTimeout(() => {
            let percent = this.getSliderPercent()
            this._$trackProgress.style.width = percent * 100 + '%'
        }, 0)
    }

    getSliderPercent() {
        return (parseInt(this._$input.value) - parseInt(this._$input.min)) / this._range
    }

    getInput() {
        return this._$input
    }
}

InputRangeCustom.defaultOptions = {
    valuesByTick: null, // number of values between 2 ticks ()
    className: null
}
