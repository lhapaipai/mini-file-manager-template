function arraysEqual(a, b, order = false) {
    if (a === b) return true
    if (a == null || b == null) return false
    if (a.length !== b.length) return false

    if (!order) {
        for (let i = 0; i < a.length; ++i) {
            if (a[i] !== b[i]) return false
        }
    } else {
        let aSorted = [...a].sort()
        let bSorted = [...b].sort()
        for (let i = 0; i < aSorted.length; ++i) {
            if (aSorted[i] !== bSorted[i]) return false
        }
    }
    return true
}

function triggerEvent(type, $el) {
    let event = new Event(type, {
        bubbles: true
    })
    $el.dispatchEvent(event)
}

export default class SelectCustom {
    constructor(element, config, i18n = {}) {
        this.$el = element
        if (!config && this.$el.dataset.ogoxeSelectCustom) {
            let dataset = JSON.parse(this.$el.dataset.ogoxeSelectCustom)
            config = dataset.config || {}
            i18n = dataset.i18n || {}
        }
        this.config = Object.assign({}, SelectCustom.defaultConfig, config || {})
        this.i18n = Object.assign({}, SelectCustom.i18n, i18n)
        this.selectedOptions = []
        this.placeholder =
            this.$el.getAttribute('placeholder') ||
            this.config.placeholder ||
            'Choisissez une option'
        this._className = 'ogoxe-select'
        this._idCounter = 0
        this.$container = null
        this.multiple = this.$el.getAttribute('multiple') !== null
        this.disabled = this.$el.getAttribute('disabled') !== null || this.config.readonly

        this._onClicked = this._onClicked.bind(this)
        this._onKeyPressed = this._onKeyPressed.bind(this)
        this._onClickedOutside = this._onClickedOutside.bind(this)
        this._triggerFocusIn = triggerEvent.bind(this, 'focusin', this.$el)
        this._triggerFocusOut = triggerEvent.bind(this, 'focusout', this.$el)
        this._onSearchChanged = this._onSearchChanged.bind(this)

        this._onItemClicked = this._onItemClicked.bind(this)
        this.create(this.config.data)
    }

    create(data) {
        this.$el.style.display = 'none'
        if (data) {
            this.processData(data)
        } else {
            this.extractData()
        }

        this.renderDropDown()
        this.bindEvent()
    }

    processData(data) {
        let options = []
        data.forEach((itemData) => {
            options.push({
                data: itemData,
                attributes: {
                    selected: false,
                    disabled: false,
                    optgroup: itemData.value === 'optgroup'
                },
                id: this._idCounter++
            })
        })

        this.infos = options
    }

    extractData() {
        let $options = this.$el.querySelectorAll('option,optgroup')
        let data = []
        let options = []
        let selectedOptions = []

        $options.forEach(($option) => {
            let itemData
            if ($option.tagName == 'OPTGROUP') {
                itemData = {
                    label: $option.label,
                    value: 'optgroup'
                }
            } else {
                if (!$option.value) {
                    this.placeholder = $option.innerText
                }

                itemData = {
                    label: $option.innerText,
                    value: $option.value
                }
            }

            let itemAttributes = {
                selected: $option.selected,
                disabled: $option.disabled,
                optgroup: $option.tagName == 'OPTGROUP'
            }

            data.push(itemData)
            options.push({
                data: itemData,
                attributes: itemAttributes,
                id: this._idCounter++
            })
        })

        this.data = data
        this.infos = options
        this.infos.forEach((itemInfos) => {
            if (itemInfos.attributes.selected) {
                selectedOptions.push(itemInfos)
            }
        })

        this.selectedOptions = selectedOptions
    }

    update() {
        if (this.$container) {
            let open = this.$container.classList.contains('open')
            this.$container.remove()
            this.create()

            if (open) {
                triggerEvent('click', this.$container)
            }
        }
    }

    disable() {
        if (!this.disabled) {
            this.disabled = true
            this.$container.classList.add('disabled')
        }
    }

    enable() {
        if (this.disabled) {
            this.disabled = false
            this.$container.classList.remove('disabled')
        }
    }

    clearSelection() {
        this.selectedOptions = []
        this._renderSelectTitle()

        this.infos.forEach((itemInfos) => {
            itemInfos.$el.classList.remove('selected')
        })
        this.$list.querySelectorAll('.fake-input').forEach((i) => i.classList.remove('checked'))

        // real select
        this.$el.querySelectorAll('option').forEach((o) => {
            o.selected = false
            o.removeAttribute('selected')
        })

        triggerEvent('change', this.$el)
    }

    renderDropDown() {
        let classes = [
            this._className + '-custom',
            this.$el.className || '',
            this.disabled ? 'disabled' : '',
            this.multiple ? 'has-multiple' : '',
            this.config.showSelectionAsTags ? 'selection-tags' : '',
            this.config.hideInputs ? 'hide-inputs' : ''
        ]

        let $container = (this.$container = document.createElement('div'))
        $container.className = classes.join(' ')
        if (!this.disabled) {
            $container.tabIndex = 0
        }

        let $selection = (this.$selection = document.createElement('span'))
        $selection.classList.add('selection')
        let $dropdown = document.createElement('div')
        $dropdown.classList.add('dropdown')

        if (this.config.searchable) {
            let $searchContainer = document.createElement('div')
            $searchContainer.className = 'search-box'

            let $searchInput = (this.$searchInput = document.createElement('input'))
            $searchInput.type = 'text'
            $searchInput.classList.add('ogoxe-input-text')
            $searchInput.classList.add('search-input')

            $searchInput.placeholder = this.i18n.searchPlaceholder

            $searchContainer.append($searchInput)
            $dropdown.append($searchContainer)
        }

        let $list = (this.$list = document.createElement('ul'))
        $list.classList.add('list')

        $dropdown.append($list)

        $container.append($selection, $dropdown)

        if (!this.disabled) {
            let $arrow = document.createElement('span')
            $arrow.classList.add('arrow')
            $container.append($arrow)
        }

        this.$el.after($container)

        this._renderSelectTitle()
        this._renderItems()
    }

    _renderSelectTitle() {
        this.$selection.innerHTML = ''

        if (this.selectedOptions.length == 0) {
            let $placeholder = document.createElement('span')
            $placeholder.innerText = this.placeholder

            this.$selection.append($placeholder)
        } else if (this.selectedOptions.length == 1 || this.config.showSelectionAsTags) {
            this.selectedOptions.forEach((item) => {
                let $item = document.createElement('span')
                if (this.multiple && this.config.showSelectionAsTags) {
                    $item.className = 'tag'
                }
                $item.innerText = item.data.label
                this.$selection.append($item)
            })
        } else {
            let $placeholder = document.createElement('span')
            $placeholder.innerText =
                this.selectedOptions.length + this.i18n.selectedItemsPlaceholder
            this.$selection.append($placeholder)
        }
    }
    _renderItems() {
        this.infos.forEach((itemInfos) => {
            let $item = document.createElement('li')
            let { selected, disabled, optgroup } = itemInfos.attributes

            if (optgroup) {
                $item.classList.add('optgroup')
            } else {
                $item.dataset.value = itemInfos.data.value
                $item.dataset.id = itemInfos.id
                $item.classList.add('option')
                if (selected) {
                    $item.classList.add('selected')
                }
                if (disabled) {
                    $item.classList.add('disabled')
                }
                $item.addEventListener('click', this._onItemClicked)

                let $span = document.createElement('span')
                $span.type = this.multiple ? 'checkbox' : 'radio'
                $span.classList.add('fake-input')
                $span.classList.add(this.multiple ? 'ogoxe-input-checkbox' : 'ogoxe-input-radio')
                if (disabled) {
                    $span.classList.add('disabled')
                }
                if (selected) {
                    $span.classList.add('checked')
                }

                $item.append($span)
            }

            let $label = document.createElement('span')
            $label.className = 'fake-label'
            $label.innerText = itemInfos.data.label

            $item.append($label)

            this.$list.append($item)
            itemInfos.$el = $item
        })
    }

    bindEvent() {
        if (this.disabled) {
            return
        }
        this.$container.addEventListener('click', this._onClicked)
        this.$container.addEventListener('keydown', this._onKeyPressed)
        this.$container.addEventListener('focusin', this._triggerFocusIn)
        this.$container.addEventListener('focusout', this._triggerFocusOut)
        window.addEventListener('click', this._onClickedOutside)

        if (this.config.searchable) {
            this.$searchInput.addEventListener('click', this._stopPropagation)
            this.$searchInput.addEventListener('input', this._onSearchChanged)
        }
    }

    _stopPropagation(e) {
        e._stopPropagation()
        return false
    }

    _onSearchChanged(e) {
        let open = this.$container.classList.contains('open')
        let text = e.target.value
        text = text.toLowerCase()

        if (text == '') {
            this.infos.forEach((itemInfos) => {
                itemInfos.$el.style.display = ''
            })
        } else if (open) {
            let matchReg = new RegExp(text)
            this.infos.forEach((itemInfos) => {
                let itemLabel = itemInfos.data.label.toLowerCase()
                let matched = matchReg.test(itemLabel)
                itemInfos.$el.style.display = matched ? '' : 'none'
            })
        }

        this.$container.querySelectorAll('.focus').forEach((i) => {
            i.classList.remove('focus')
        })

        let $first = this._findNext(null)
        $first.classList.add('focus')
    }

    _getItemInfoFromElt(elt) {
        let id = parseInt(elt.dataset.id)
        return this.infos.find((i) => i.id === id)
    }

    selectItem(value) {
        if (typeof value === 'number') {
            value = value.toString()
        }
        let info = this.infos.find((info) => info.data.value === value)
        if (info) {
            if (!arraysEqual([info], this.selectedOptions, true)) {
                this._onOptionClicked(info.$el)
                // console.log('ogoxe select selectItem: avt', this.selectedOptions, ', après :', [info], info)
            } else {
                // console.log("ogoxe select pas de changement")
            }
        }
    }

    _onItemClicked(e) {
        let $option = e.target.closest('.option')
        this._onOptionClicked($option)
    }

    _onOptionClicked($option) {
        let itemInfos = this._getItemInfoFromElt($option)
        if (!$option.classList.contains('disabled')) {
            // ici on retire les selections
            if (this.multiple) {
                if ($option.classList.contains('selected')) {
                    // fake select
                    $option.classList.remove('selected')
                    $option.querySelector('.fake-input').classList.remove('checked')

                    // real select
                    let $item = this.$el.querySelector(`option[value="${$option.dataset.value}"]`)
                    if ($item) {
                        $item.selected = false
                        $item.removeAttribute('selected')
                    }

                    this.selectedOptions.splice(this.selectedOptions.indexOf(itemInfos), 1)
                } else {
                    this.selectedOptions.push(itemInfos)
                }
            } else {
                // fake select
                this.selectedOptions.forEach((itemInfos) => {
                    itemInfos.$el.classList.remove('selected')
                })
                this.$list
                    .querySelectorAll('.fake-input')
                    .forEach((i) => i.classList.remove('checked'))

                // real select
                this.$el.querySelectorAll('option').forEach((o) => {
                    o.selected = false
                    o.removeAttribute('selected')
                })

                this.selectedOptions = [itemInfos]
            }

            // ici on les ajoute
            this.selectedOptions.forEach((itemInfos) => {
                let $item = this.$el.querySelector(`option[value="${itemInfos.data.value}"]`)
                if ($item) {
                    $item.setAttribute('selected', true)
                    $item.selected = true
                    itemInfos.$el.querySelector('.fake-input').classList.add('checked')
                    itemInfos.$el.classList.add('selected')
                }
            })
            this._renderSelectTitle()

            triggerEvent('change', this.$el)
        }
    }

    _onClicked(e) {
        let containerBottom = this.$container.getBoundingClientRect().bottom
        if (document.documentElement.clientHeight - containerBottom < 170) {
            this.$container.classList.add('reversed')
        } else {
            this.$container.classList.remove('reversed')
        }

        if (this.multiple) {
            if (e.target.closest('.selection')) {
                this.$container.classList.toggle('open')
            } else {
                this.$container.classList.add('open')
            }
        } else {
            this.$container.classList.toggle('open')
        }

        if (this.$container.classList.contains('open')) {
            if (this.$searchInput) {
                this.$searchInput.value = ''
                this.$searchInput.focus()
                this.$container.querySelectorAll('ul li').forEach((i) => (i.style.display = ''))
            }

            let t = this.$container.querySelector('.focus')
            if (t) {
                t.classList.remove('focus')
            }

            let currentOption = e.target.closest('.option')
            if (currentOption) {
                currentOption.classList.add('focus')
            }
        } else {
            // on a fermé le dropdown mais on souhaite que le focus soit
            // toujours sur lui
            this.$container.focus()
        }
    }

    _onKeyPressed(e) {
        let $focusedItem = this.$container.querySelector('.focus')
        let open = this.$container.classList.contains('open')

        if (e.key === 'Tab' || e.key == 'Escape') {
            if (open) {
                if (this.multiple) {
                    triggerEvent('click', this.$selection)
                } else {
                    triggerEvent('click', this.$container)
                }
                e.preventDefault()
            }
        } else if (e.key === 'Enter') {
            if (open) {
                if (this.multiple) {
                    triggerEvent('click', this.$selection)
                } else if ($focusedItem) {
                    triggerEvent('click', $focusedItem)
                }
                e.preventDefault()
            }
        } else if (e.code == 'Space') {
            if (open) {
                if ($focusedItem) {
                    triggerEvent('click', $focusedItem)
                }
            } else {
                triggerEvent('click', this.$container)
            }
            e.preventDefault()
        } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
            if (!open) {
                triggerEvent('click', this.$container)
            } else {
                var $next = this._findNext($focusedItem)
                if ($next) {
                    if ($focusedItem) {
                        $focusedItem.classList.remove('focus')
                    }
                    $next.classList.add('focus')
                }
            }
            e.preventDefault()
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
            if (!open) {
                triggerEvent('click', this.$container)
            } else {
                var $prev = this._findPrev($focusedItem)
                if ($prev) {
                    if ($focusedItem) {
                        $focusedItem.classList.remove('focus')
                    }
                    $prev.classList.add('focus')
                }
            }
            e.preventDefault()
        }
        return false
    }

    _findNext($el) {
        if ($el) {
            $el = $el.nextElementSibling
        } else {
            $el = this.$container.querySelector('.list .option')
        }

        while ($el) {
            if (
                !$el.classList.contains('disabled') &&
                !$el.classList.contains('optgroup') &&
                $el.style.display != 'none'
            ) {
                return $el
            }
            $el = $el.nextElementSibling
        }

        return null
    }

    _findPrev($el) {
        if ($el) {
            $el = $el.previousElementSibling
        } else {
            $el = this.$container.querySelector('.list .option:last-child')
        }

        while ($el) {
            if (
                !$el.classList.contains('disabled') &&
                !$el.classList.contains('optgroup') &&
                $el.style.display != 'none'
            ) {
                return $el
            }
            $el = $el.previousElementSibling
        }

        return null
    }

    _onClickedOutside(e) {
        if (!this.$container.contains(e.target)) {
            this.$container.classList.remove('open')
        }
    }

    destroy() {
        if (!this.disabled) {
            this.infos.forEach((itemInfos) => {
                itemInfos.$el.removeEventListener('click', this._onItemClicked)
            })

            this.$container.removeEventListener('click', this._onClicked)
            this.$container.removeEventListener('keydown', this._onKeyPressed)
            this.$container.removeEventListener('focusin', this._triggerFocusIn)
            this.$container.removeEventListener('focusout', this._triggerFocusOut)
            window.removeEventListener('click', this._onClickedOutside)

            if (this.config.searchable) {
                this.$searchInput.removeEventListener('click', this._stopPropagation)
                this.$searchInput.removeEventListener('input', this._onSearchChanged)
            }
        }
        this.$el.style.display = ''
        this.$container.remove()
    }
}

SelectCustom.defaultConfig = {
    readonly: false,
    hideInputs: false,

    searchable: false,

    // only with multiple
    showSelectionAsTags: false
}

SelectCustom.i18n = {
    searchPlaceholder: 'Rechercher...',
    selectedItemsPlaceholder: ' éléments sélectionnés'
}
