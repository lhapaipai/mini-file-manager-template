import './_index.scss'

import markerHtml from './marker.html'
import recordHtml from './record.html'
import popupHtml from './popup.html'

import '~leaflet/layer/marker/OgoxeIcon'
import '~leaflet/layer/marker/OgoxeMarker'

export default {
    title: 'UiKit/Carte'
}

export const Marker = () => ({ template: markerHtml })
export const Record = () => ({ template: recordHtml })
export const Popup = () => ({ template: popupHtml })

export const OgoxeMarker = () => ({
    async mounted() {
        let map = L.map(this.$refs.app, { closePopupOnClick: false }).setView([51.505, -0.15], 13)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map)

        /* help */
        new L.Popup({
            offset: [0, -50]
        })
            .setLatLng([51.5, -0.05])
            .setContent('Cliquez sur le marqueur pour changer sa couleur.')
            .openOn(map)

        /* code */
        new L.OgoxeMarker([51.5, -0.25], `fe-station-met`).addTo(map)

        new L.OgoxeMarker([51.5, -0.2], `fe-station-met`, {
            active: false
        }).addTo(map)

        new L.OgoxeMarker([51.5, -0.15], `fe-station-met`, {
            enabled: false
        }).addTo(map)

        new L.OgoxeMarker([51.5, -0.1], `fe-station-met`, {
            defaultState: 'no-alert'
        }).addTo(map)

        let marker = new L.OgoxeMarker([51.5, -0.05], `fe-station-mf`).addTo(map)
        let states = ['alert-1', 'alert-2', 'alert-3', 'no-alert']
        marker.on('click', () => {
            let randomState = states[parseInt(Math.random() * 4)]
            marker.setState(randomState)
        })
    },
    template: `<div ref="app" style="width: 100%; height: 90vh;"></div>`
})
