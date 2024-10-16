import { reactive } from 'vue'
import path from 'path'
import convertToPixels from '../helpers/convert-to-pixels.js'

type ProjectConfig = {
    width?: string
    height?: string
    ppi?: number
    colors?: string[]
}

export const projectConfigStore = reactive({
    signal: 0,
    width: '63mm',
    height: '88mm',
    ppi: 300,
    workingDirectory: '',
    projectName: '',
    colorPalette: ['#000000', '#FFFFFF'],
    filters: {
        cards: {
            cardSize: 200,
            showFront: true,
            showBack: true,
            searchText: '',
            tags: [],
        },
        templates: {
            cardSize: 200,
            searchText: '',
        },
        editExport: {
            cardSize: 200,
            searchText: '',
        },
        editCard: {
            cardSize: 200,
            showFront: true,
            showBack: true,
            overlay: false,
        },
        editTemplate: {
            cardSize: 200,
            showComponentMargins: false,
        },
    },
    path: '',
    setProject(projectPath: string) {
        this.workingDirectory = path.dirname(projectPath)
        this.projectName = path.basename(projectPath)
        this.path = projectPath
        loadConfig()
        this.signal = Math.random()
    },
    setConfigs(config: ProjectConfig) {
        this.width = config.width || this.width
        this.height = config.height || this.height
        this.ppi = config.ppi || this.ppi
        this.colorPalette = config.colors ?? this.colorPalette
        saveConfig()
        this.signal = Math.random()
    },
    getParsedSizes() {
        return {
            width: convertToPixels(this.width, this.ppi),
            height: convertToPixels(this.height, this.ppi),
        }
    },
})

async function loadConfig() {
    const file = await window.electronAPI.loadFile(projectConfigStore.path)
    if (file) {
        const buffer = Buffer.from(file, 'base64')
        const config = JSON.parse(buffer.toString('utf8'))
        projectConfigStore.width = config.width
        projectConfigStore.height = config.height
        projectConfigStore.ppi = config.ppi
        projectConfigStore.filters = config.filters
        projectConfigStore.colorPalette = config.colorPalette
    }
    projectConfigStore.signal = Math.random()
}

export async function saveConfig() {
    const content = {
        version: '0.1',
        width: projectConfigStore.width,
        height: projectConfigStore.height,
        ppi: projectConfigStore.ppi,
        filters: projectConfigStore.filters,
        colorPalette: projectConfigStore.colorPalette,
    }
    window.electronAPI.saveFile(projectConfigStore.path, Buffer.from(JSON.stringify(content, null, 4)))
}


