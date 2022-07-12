import './_index.scss'
import '../layouts/index.scss'
import flashHtml from './flash.html'
import footerHtml from './footer.html'
import headerHtml from './header.html'
import keyValuesHtml from './key_values.html'
// list
import navbarHtml from './navbar.html'
import pulseHtml from './pulse.html'
import sidebarsHtml from './sidebars.html'
import sidebarContentHtml from './sidebar-content.html'
import tabsHtml from './tabs.html'
import tagHtml from './tag.html'
import tooltipHtml from './tooltip.html'

import { MiniTip } from '~/components/mini-tip/mini-tip'

export default {
    title: 'UiKit/Components'
}

export const Flash = () => ({ template: flashHtml })
export const Footer = () => ({ template: footerHtml })
export const Header = () => ({ template: headerHtml })
export const KeyValues = () => ({ template: keyValuesHtml })
export const Navbar = () => ({ template: navbarHtml })
export const Pulse = () => ({
    template: pulseHtml,
    mounted() {
        document.getElementById('pulse-button').addEventListener('click', () => {
            document.querySelectorAll('.with-pulse').forEach((e) => {
                e.classList.add('pulse')

                setTimeout(() => {
                    e.classList.remove('pulse')
                }, 10)
            })
        })
    }
})
export const Sidebars = () => ({ template: sidebarsHtml })
export const SidebarContent = () => ({ template: sidebarContentHtml })
export const Tabs = () => ({ template: tabsHtml })
export const Tag = () => ({ template: tagHtml })
export const Tooltip = () => ({
    template: tooltipHtml,
    mounted() {
        document.querySelectorAll('[aria-label][role~="tooltip"]').forEach((e) => {
            new MiniTip(e)
        })
    }
})
