function triggerEvent(type, $el) {
    let event = new Event(type, {
        bubbles: true
    })
    $el.dispatchEvent(event)
}

function removeChildren($elt) {
    while ($elt.firstChild) {
        $elt.firstChild.remove()
    }
}

function rebuildSelectWithOptions($elt, options, selection = []) {
    removeChildren($elt)
    for (let option of options) {
        if (option.value === 'optgroup') {
            continue
        }
        let $option = document.createElement('option')
        $option.value = option.value
        $option.setAttribute('value', option.value)
        $option.innerText = option.label
        $option.selected = selection.indexOf(option.value) === -1 ? false : true
        $elt.append($option)
    }
}

function getDatasetConfig($elt, configPrefix) {
    let datasetConfig = {}
    for (let [completeKey, value] of Object.entries($elt.dataset)) {
        if (completeKey.indexOf(configPrefix) === 0 && completeKey !== configPrefix) {
            let key =
                completeKey[configPrefix.length].toLowerCase() +
                completeKey.substring(configPrefix.length + 1)
            if (key === 'i18n') {
                datasetConfig.i18n = JSON.parse(value)
            } else {
                datasetConfig[key] = value === '' ? true : value
            }
        }
    }

    return datasetConfig
}

/**
 * SelectCustom récupère la class de l'elmt <select> et y ajoute un ...-custom
 */
export default class SelectCustom {
    constructor($select, config = {}) {
        this.$select = $select
        this.ready = false

        let datasetConfig = getDatasetConfig($select, 'selectCustom')

        this.i18n = Object.assign(
            {},
            SelectCustom.defaultConfig.i18n,
            datasetConfig.i18n,
            config.i18n
        )
        this.config = Object.assign({}, SelectCustom.defaultConfig, datasetConfig, config)
        delete this.config.i18n

        this.selectedItemsInfos = []
        this.placeholder =
            this.config.placeholder || this.$select.getAttribute('placeholder') || 'Choisissez'
        this._idCounter = 0
        this.$divContainer = null
        this.multiple = this.$select.getAttribute('multiple') !== null
        this.disabled = this.config.readonly || this.$select.getAttribute('disabled') !== null

        this._onDivContainerClicked = this._onDivContainerClicked.bind(this)
        this._onKeyPressed = this._onKeyPressed.bind(this)
        this._onClickedOutside = this._onClickedOutside.bind(this)
        this._triggerFocusIn = triggerEvent.bind(this, 'focusin', this.$select)
        this._triggerFocusOut = triggerEvent.bind(this, 'focusout', this.$select)
        this._onSearchChanged = this._onSearchChanged.bind(this)

        this._onItemClicked = this._onItemClicked.bind(this)
        this._prepareData(this.config.data)
        this._create()

        this.$select._select_custom = this
    }

    _prepareData(data, previousSelection = []) {
        if (data) {
            // se base sur data et previousSelection pour construire this.itemsInfos et this.selectedItemsInfos
            this._processData(data, previousSelection)

            // synchronise les data avec les <option>
            rebuildSelectWithOptions(this.$select, data, previousSelection)
        } else {
            // se base sur <option,optgroup> pour construire this.itemsInfos et this.selectedItemsInfos
            this._extractData()
        }
    }

    _create(activateTransitions = true) {
        this.$select.style.display = 'none'

        this._renderDropDown()
        this._renderSelectTitle()
        this._renderItems()

        if (activateTransitions) {
            this.$dropdown.classList.remove('no-transition')
        }
        // _create is called with constructor or update (with update $divContainer is removed so event must be reassigned)
        this._bindEvent()
    }

    // remplis les objets itemsInfos et selectedItemsInfos à partir de data et previousSelection
    _processData(data, previousSelection = []) {
        let selectedItemsInfos = []
        let itemsInfos = []
        data.forEach((itemData) => {
            let itemInfos = {
                data: itemData,
                attributes: {
                    selected: previousSelection.indexOf(itemData.value) === -1 ? false : true,
                    disabled: false,
                    optgroup: itemData.value === 'optgroup'
                },
                id: this._idCounter++
            }
            itemsInfos.push(itemInfos)
            if (itemInfos.attributes.selected) {
                selectedItemsInfos.push(itemInfos)
            }
        })

        this.itemsInfos = itemsInfos
        this.selectedItemsInfos = selectedItemsInfos
    }

    _extractData() {
        let $options = this.$select.querySelectorAll('option,optgroup')
        // let data = [];
        let itemsInfos = []
        let selectedItemsInfos = []

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

            let itemInfos = {
                data: itemData,
                attributes: {
                    selected: $option.selected,
                    disabled: $option.disabled,
                    optgroup: $option.tagName == 'OPTGROUP'
                },
                id: this._idCounter++
            }
            // data.push(itemData);

            // if (itemInfos.attributes.selected) {
            //     $option.setAttribute('selected', 'selected')
            // } else {
            //     $option.removeAttribute('selected')
            // }

            if (itemInfos.attributes.selected) {
                selectedItemsInfos.push(itemInfos)
            }
            itemsInfos.push(itemInfos)
        })

        // this.data = data;
        this.itemsInfos = itemsInfos
        this.selectedItemsInfos = selectedItemsInfos
    }

    update(data = null) {
        let activateTransitions = false

        if (this.$divContainer) {
            let open = this.$divContainer.classList.contains('open')
            let previousSelection = this.selectedItemsInfos.map(
                (selectedItemInfos) => selectedItemInfos.data.value
            )
            this.selectedItemsInfos = []
            this.$divContainer.remove()
            this._prepareData(data, previousSelection)
            this._create(activateTransitions)

            if (open) {
                triggerEvent('click', this.$divContainer)
            }
            setTimeout(() => {
                this.$dropdown.classList.remove('no-transition')
            }, 0)
        }
    }

    disable() {
        if (!this.disabled) {
            this.disabled = true
            this.$divContainer.classList.add('disabled')
        }
    }

    enable() {
        if (this.disabled) {
            this.disabled = false
            this.$divContainer.classList.remove('disabled')
        }
    }

    // crée tous les containers mais ne génère pas l'intérieur du <ul>
    _renderDropDown() {
        let classes = [
            `${this.config.classPrefix}select-custom`,
            this.disabled ? 'disabled' : '',
            this.multiple ? 'has-multiple' : '',
            this.config.showSelectionAsTags ? 'selection-tags' : '',
            this.config.hideInputs ? 'hide-inputs' : ''
        ]

        let $divContainer = (this.$divContainer = document.createElement('div'))

        $divContainer.className = classes.join(' ')
        if (!this.disabled) {
            $divContainer.tabIndex = 0
        }

        let $selection = (this.$selection = document.createElement('span'))
        $selection.classList.add('selection')
        let $dropdown = (this.$dropdown = document.createElement('div'))
        $dropdown.classList.add('dropdown', 'no-transition')

        if (this.config.searchable) {
            let $searchContainer = document.createElement('div')
            $searchContainer.className = 'search-box'

            let $searchInput = (this.$searchInput = document.createElement('input'))
            $searchInput.type = 'text'
            $searchInput.classList.add(`${this.config.classPrefix}input-text`, 'search-input')
            $searchInput.placeholder = this.i18n.searchPlaceholder

            $searchContainer.append($searchInput)
            $dropdown.append($searchContainer)
        }

        let $ul = (this.$ul = document.createElement('ul'))
        $ul.classList.add('list')

        $dropdown.append($ul)

        let $arrow = document.createElement('span')
        $arrow.classList.add('arrow')

        $divContainer.append($selection, $dropdown, $arrow)

        this.$select.after($divContainer)
    }

    _renderSelectTitle() {
        this.$selection.innerHTML = ''

        if (this.selectedItemsInfos.length == 0) {
            let $placeholder = document.createElement('span')
            $placeholder.innerHTML = this.placeholder

            this.$selection.append($placeholder)
        } else if (this.selectedItemsInfos.length == 1 || this.config.showSelectionAsTags) {
            this.selectedItemsInfos.forEach((item) => {
                let $item = document.createElement('span')
                if (this.multiple && this.config.showSelectionAsTags) {
                    $item.className = 'tag'
                }
                $item.innerHTML = item.data.label
                this.$selection.append($item)
            })
        } else {
            let $placeholder = document.createElement('span')
            $placeholder.innerHTML =
                this.selectedItemsInfos.length + this.i18n.selectedItemsPlaceholder
            this.$selection.append($placeholder)
        }
    }
    _renderItems() {
        this.itemsInfos.forEach((itemInfos) => {
            let $li = document.createElement('li')
            let { selected, disabled, optgroup } = itemInfos.attributes

            if (optgroup) {
                $li.classList.add('optgroup')
            } else {
                $li.dataset.value = itemInfos.data.value
                $li.dataset.id = itemInfos.id
                $li.className = [
                    'option',
                    disabled ? 'disabled' : '',
                    selected ? 'selected' : ''
                ].join(' ')
                $li.addEventListener('click', this._onItemClicked)

                let $span = document.createElement('span')
                $span.type = this.multiple ? 'checkbox' : 'radio'
                $span.className = [
                    'fake-input',
                    this.multiple ? 'ogoxe-input-checkbox' : 'ogoxe-input-radio',
                    disabled ? 'disabled' : '',
                    selected ? 'checked' : ''
                ].join(' ')

                $li.append($span)
            }

            let $label = document.createElement('span')
            $label.className = 'fake-label'
            $label.innerHTML = itemInfos.data.label

            $li.append($label)

            this.$ul.append($li)
            itemInfos.$el = $li
        })
    }
    _bindEvent() {
        // after
        this.$divContainer.addEventListener('click', this._onDivContainerClicked)
        this.$divContainer.addEventListener('keydown', this._onKeyPressed)
        this.$divContainer.addEventListener('focusin', this._triggerFocusIn)
        this.$divContainer.addEventListener('focusout', this._triggerFocusOut)

        if (this.config.searchable) {
            this.$searchInput.addEventListener('click', this._stopPropagation)
            this.$searchInput.addEventListener('input', this._onSearchChanged)
        }
        if (!this.ready) {
            window.addEventListener('click', this._onClickedOutside)
            this.ready = true
        }
    }
    _stopPropagation(e) {
        e._stopPropagation()
        return false
    }
    _onSearchChanged(e) {
        let open = this.$divContainer.classList.contains('open')
        let text = e.target.value
        text = text.toLowerCase()

        if (text == '') {
            this.itemsInfos.forEach((itemInfos) => {
                itemInfos.$el.style.display = ''
            })
        } else if (open) {
            let matchReg = new RegExp(text)
            this.itemsInfos.forEach((itemInfos) => {
                let itemLabel = itemInfos.data.label.toLowerCase()
                let matched = matchReg.test(itemLabel)
                itemInfos.$el.style.display = matched ? '' : 'none'
            })
        }

        this.$divContainer.querySelectorAll('.focus').forEach((i) => {
            i.classList.remove('focus')
        })

        let $first = this._findNext(null)
        $first.classList.add('focus')
    }

    _getItemInfoFromElt(elt) {
        let id = parseInt(elt.dataset.id)
        return this.itemsInfos.find((i) => i.id === id)
    }

    clearSelection() {
        this.selectedItemsInfos = []
        this._renderSelectTitle()

        this.itemsInfos.forEach((itemInfos) => {
            itemInfos.$el.classList.remove('selected')
        })
        this.$ul.querySelectorAll('.fake-input').forEach((i) => i.classList.remove('checked'))

        // real select
        this.$select.querySelectorAll('option').forEach((o) => {
            o.selected = false
            o.removeAttribute('selected')
        })

        triggerEvent('change', this.$select)
    }

    getSelection() {
        let selection = this.itemsInfos
            .filter((itemInfos) => {
                return itemInfos.attributes.selected && itemInfos.data.value !== ''
            })
            .map((itemInfos) => itemInfos.data.value)

        if (this.multiple) {
            return selection
        } else {
            return selection.length > 0 ? selection[0] : null
        }
    }

    _updateSelectWithValues(vals) {
        let modified = false

        for (const $option of this.$select.querySelectorAll('option')) {
            let val = $option.value

            if (vals.indexOf(val) !== -1) {
                if ($option.selected) {
                    continue
                }
                modified = true
                $option.setAttribute('selected', 'selected')
                $option.selected = true
            } else {
                if (!$option.selected) {
                    continue
                }

                modified = true
                $option.removeAttribute('selected')
                $option.selected = false
            }
        }

        return modified
    }

    select(values) {
        if (values instanceof Array) {
            if (!this.multiple) {
                values = [values[0]]
            }
        } else {
            values = [values]
        }
        values = values.map((val) => (val === null || val === undefined ? null : val.toString()))

        let modified = this._updateSelectWithValues(values)
        if (modified) {
            this.update()
            triggerEvent('change', this.$select)
        }
    }

    // on a cliqué sur un item
    // s'assurer d'abord qu'on est bien sur l'élément parent <li>
    _onItemClicked(e) {
        let $li = e.target.closest('.option')
        this._onLiClicked($li)
    }

    _onLiClicked($li) {
        let itemInfos = this._getItemInfoFromElt($li)
        if (!$li.classList.contains('disabled')) {
            if (this.multiple) {
                if ($li.classList.contains('selected')) {
                    // l'élément est déjà sélectionné, on le retire de la sélection

                    // fake select
                    $li.classList.remove('selected')
                    $li.querySelector('.fake-input').classList.remove('checked')
                    itemInfos.attributes.selected = false

                    // real select
                    let $item = this.$select.querySelector(`option[value="${$li.dataset.value}"]`)
                    if ($item) {
                        $item.selected = false
                        $item.removeAttribute('selected')
                    }

                    this.selectedItemsInfos.splice(this.selectedItemsInfos.indexOf(itemInfos), 1)
                } else {
                    this.selectedItemsInfos.push(itemInfos)
                    itemInfos.attributes.selected = true
                }
            } else {
                // simple (non-multiple)

                // fake select
                this.selectedItemsInfos.forEach((itemInfos) => {
                    itemInfos.$el.classList.remove('selected')
                    itemInfos.attributes.selected = false
                })
                this.$ul
                    .querySelectorAll('.fake-input')
                    .forEach((i) => i.classList.remove('checked'))

                // real select
                this.$select.querySelectorAll('option').forEach((o) => {
                    o.selected = false
                    o.removeAttribute('selected')
                })

                this.selectedItemsInfos = [itemInfos]
            }

            // ici on les ajoute
            this.selectedItemsInfos.forEach((itemInfos) => {
                itemInfos.attributes.selected = true
                let $item = this.$select.querySelector(`option[value="${itemInfos.data.value}"]`)
                if ($item) {
                    // fake select
                    itemInfos.$el.querySelector('.fake-input').classList.add('checked')
                    itemInfos.$el.classList.add('selected')

                    // real select
                    $item.setAttribute('selected', true)
                    $item.selected = true
                }
            })
            this._renderSelectTitle()

            triggerEvent('change', this.$select)
        }
    }

    // on a cliqué sur le $divContainer
    _onDivContainerClicked(e) {
        let containerBottom = this.$divContainer.getBoundingClientRect().bottom
        if (document.documentElement.clientHeight - containerBottom < 170) {
            this.$divContainer.classList.add('reversed')
        } else {
            this.$divContainer.classList.remove('reversed')
        }

        if (this.multiple) {
            // s'il s'agit d'une sélection multiple le dropdown change d'état (ouvert/fermé)
            if (e.target.closest('.selection')) {
                this.$divContainer.classList.toggle('open')
            } else {
                this.$divContainer.classList.add('open')
            }
        } else {
            // s'il s'agit d'une sélection simple le dropdown prend l'état ouvert
            this.$divContainer.classList.toggle('open')
        }

        if (this.$divContainer.classList.contains('open')) {
            if (this.$searchInput) {
                this.$searchInput.value = ''
                this.$searchInput.focus()
                this.$divContainer.querySelectorAll('ul li').forEach((i) => (i.style.display = ''))
            }

            let t = this.$divContainer.querySelector('.focus')
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
            this.$divContainer.focus()
        }
    }

    _onKeyPressed(e) {
        let $focusedItem = this.$divContainer.querySelector('.focus')
        let open = this.$divContainer.classList.contains('open')

        if (e.key === 'Tab' || e.key == 'Escape') {
            if (open) {
                if (this.multiple) {
                    triggerEvent('click', this.$selection)
                } else {
                    triggerEvent('click', this.$divContainer)
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
                triggerEvent('click', this.$divContainer)
            }
            e.preventDefault()
        } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
            if (!open) {
                triggerEvent('click', this.$divContainer)
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
                triggerEvent('click', this.$divContainer)
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
            $el = this.$divContainer.querySelector('.list .option')
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
            $el = this.$divContainer.querySelector('.list .option:last-child')
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

    // écouteur sur window
    _onClickedOutside(e) {
        if (!this.$divContainer.contains(e.target)) {
            this.$divContainer.classList.remove('open')
        }
    }

    destroy() {
        if (this.ready) {
            this.itemsInfos.forEach((itemInfos) => {
                itemInfos.$el.removeEventListener('click', this._onItemClicked)
            })

            this.$divContainer.removeEventListener('click', this._onDivContainerClicked)
            this.$divContainer.removeEventListener('keydown', this._onKeyPressed)
            this.$divContainer.removeEventListener('focusin', this._triggerFocusIn)
            this.$divContainer.removeEventListener('focusout', this._triggerFocusOut)
            window.removeEventListener('click', this._onClickedOutside)

            if (this.config.searchable) {
                this.$searchInput.removeEventListener('click', this._stopPropagation)
                this.$searchInput.removeEventListener('input', this._onSearchChanged)
            }
        }
        this.$select.style.display = ''
        this.$divContainer.remove()
        this.ready = false
    }
}

SelectCustom.defaultConfig = {
    classPrefix: '',

    readonly: false, // sinon regarde l'attribut disabled
    hideInputs: false,

    placeholder: null, // regarde en priorité si un élément <option> a une valeur == ''
    // sinon prend la valeur spécifiée ici
    // sinon regarde l'attribut placeholder du <select>
    searchable: false,

    // only with multiple
    showSelectionAsTags: false,

    data: null, // si on passe un tableau de data, on ne parse pas le contenu du select mais le
    // tableau de données comme référence.

    i18n: {
        searchPlaceholder: 'Rechercher...',
        selectedItemsPlaceholder: ' éléments sélectionnés'
    }
}
