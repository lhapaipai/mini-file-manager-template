import ColorsStories from './ColorsStories.vue'
import { h } from 'vue'

export default {
    title: 'UiKit/Base',
    component: ColorsStories
}

export const Color = (args) => ({
    setup() {
        return () => h(ColorsStories, args)
    }
})
