import 'electron'
/**
 * Should match main/preload.ts for typescript support in renderer
 */
export default interface ElectronApi {
    sendMessage: (message: string) => void
    openDialog: (opts: Electron.BrowserWindow) => Promise<string[]>
    saveDialog: (opts: Electron.BrowserWindow) => Promise<string>
    saveFile: (path: string, content: Buffer) => Promise<void>
    loadFile: (path: string) => Promise<string | null>
    setConfig: (path: string, value: unknown) => Promise<void>
    getConfig: (path: string, defaultValue: unknown) => Promise<unknown>
}

declare global {
    interface Window {
        electronAPI: ElectronApi
    }
}







