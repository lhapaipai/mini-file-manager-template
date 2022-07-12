export default class Tabs {
    constructor(elt) {
        this.$elt = typeof elt === 'string' ? document.querySelector(elt) : elt

        this._onClick = this._onClick.bind(this)

        this.$labelContainer = this.$elt.querySelector('.tab-labels')
        this.$contentContainer = this.$elt.querySelector('.tab-contents')

        if (!this.$labelContainer || !this.$contentContainer) {
            return
        }

        this.$labelContainer.addEventListener('click', this._onClick)
    }

    _onClick(e) {
        let $activeTab = e.target.closest('.tab-label')
        console.log($activeTab)

        this.$labelContainer.children.forEach(($child) => {
            if ($child === $activeTab) {
                $child.classList.add('active')
            } else {
                $child.classList.remove('active')
            }
        })

        this.$contentContainer.children.forEach(($content) => {
            if ($content.id === $activeTab.dataset.tabsFor) {
                $content.classList.add('active')
            } else {
                $content.classList.remove('active')
            }
        })
    }

    destroy() {
        this.$labelContainer.removeEventListener(this._onClick)
    }
}
