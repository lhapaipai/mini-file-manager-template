<template>
    <div class="panel">
        <h1>Couleurs</h1>
        <p>Cliquer sur une case pour copier le code hexadécimal</p>
        <div v-for="color in colors" :key="color">
            <h3>{{ color }}</h3>
            <div class="color-variations">
                <div
                    v-for="variation in variations"
                    :key="variation"
                    :style="{ 'background-color': nameToCode(color, variation) }"
                    @click.prevent="copyToClipboard(color, variation)"
                >
                    <div>{{ color }}{{ variation }}</div>
                    <div>{{ nameToCode(color, variation) }}</div>
                </div>
            </div>
        </div>
        <div v-for="theme in themes" :key="theme">
            <h1>{{ theme }}</h1>
            <div v-for="color in themeColors" :key="color">
                <h3>{{ color }}</h3>
                <div class="color-variations">
                    <div
                        v-for="variation in variations"
                        :key="variation"
                        :style="{ 'background-color': nameToCode(color, variation, theme) }"
                        @click.prevent="copyToClipboard(color, variation, theme)"
                    >
                        <div>{{ color }}{{ variation }}</div>
                        <div>{{ nameToCode(color, variation, theme) }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { notify } from 'mini-notifier'
import '~/ui/packages/mini-notifier/mini-notifier.scss'
export default {
    data() {
        return {
            colors: ['blue', 'cyan', 'indigo', 'grey', 'green', 'yellow', 'orange', 'red'],
            themeColors: ['primary-color', 'secondary-color'],
            variations: ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'],
            themes: [],
            currentTheme: 'theme-ogoxe',
            currentThemeUpdated: null
        }
    },
    methods: {
        nameToCode(color, variation, theme) {
            if (!theme) {
                return getComputedStyle(document.body).getPropertyValue(`--${color}${variation}`)
            }

            // very very ugly....
            let uglyBody = document.createElement('body')
            uglyBody.classList.add(theme)
            document.body.append(uglyBody)
            let value = getComputedStyle(uglyBody).getPropertyValue(`--${color}${variation}`)
            uglyBody.remove()
            return value
        },
        copyToClipboard(color, variation, theme) {
            let code = this.nameToCode(color, variation, theme)
            navigator.clipboard.writeText(code)
            notify(`${code} copié dans le presse papier.`)
        }
    }
}
</script>

<style lang="scss" scoped>
.color-variations {
    display: flex;
    flex-wrap: wrap;

    & > div {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        cursor: pointer;
        padding: 0.5rem 0;
    }

    & > div:nth-child(n + 8) {
        color: #bbb;
    }
}

h2 {
    color: black;
}

.panel {
    font-size: 1em;
}
</style>
