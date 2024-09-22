export async function pickExportFolder() {
    const pickerOpts = {
        id: 'vitral-export-folder',
        title: 'Select export destination',
        properties: ['openDirectory'],
    }
    //TODO: fix this warning
    const path = await window.electronAPI.saveDialog(pickerOpts)
    return path?.replace(/\\/g, '/')
}
