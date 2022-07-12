import { filePicker } from 'mini-file-manager/src/index'
// import '../../../mini-file-manager/dist/mini-file-manager.css'

document.querySelectorAll('[data-file-picker]').forEach(($filePicker) => {
    filePicker($filePicker)
})
