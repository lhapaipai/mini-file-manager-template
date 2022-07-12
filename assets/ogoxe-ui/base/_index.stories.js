import typographyHtml from './typography.html'
import feConfig from '~/../extra/fontello/config.json'

export default {
    title: 'UiKit/Base'
}

export const Typography = () => ({ template: typographyHtml })

let icons = [],
    iconsHtml
feConfig.glyphs.forEach((glyph) => {
    icons.push(`<span><i class="fe-${glyph.css}"></i><span>fe-${glyph.css}</span></span>`)
})

iconsHtml = `<div class="storybook-icons">${icons.join('')}</div>`

export const Icons = () => ({ template: iconsHtml })
