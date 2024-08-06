import { Template } from '../typings/template.js'
import { projectConfigStore } from './project-config-store.js'

const TEMPLATES_FOLDER = 'assets/templates/'
let saveTimer: NodeJS.Timeout | null = null

export const templatesStore = {
    templates: {} as Record<string, Template>,
    setTemplate(name: string, template: Template) {
        this.templates[name] = template
        triggerSave(name)
    },
    removeTemplate(name: string) {
        delete this.templates[name]
        triggerSave(name)
    },
}

async function saveTemplate(templateName: string) {
    const template = templatesStore.templates[templateName]
    if (template) {
        const fileName = templateName.split('.').shift()
        window.electronAPI.saveFile(
            `${projectConfigStore.workingDirectory}/${TEMPLATES_FOLDER}${fileName}.json`,
            Buffer.from(JSON.stringify(template, null, 4)),
        )
    }
}

function triggerSave(templateName: string) {
    if (saveTimer) {
        clearTimeout(saveTimer)
    }
    saveTimer = setTimeout(async () => {
        saveTemplate(templateName)
    }, 5000)
}

async function getFileName(path: string): Promise<string> {
    const fileName = path.split(TEMPLATES_FOLDER).pop()
    if (fileName) {
        return fileName
    }
    throw new Error('Could not get file name')
}

async function loadTemplate(path: string): Promise<Template> {
    const data = await window.electronAPI.loadFile(path)
    if (data) {
        return JSON.parse(data)
    }
    throw new Error('Could not load template')
}

async function onFileChanged(path: string, event: string) {
    //TODO: add file blacklist for extensions
    if (path.includes(TEMPLATES_FOLDER)) {
        const fileName = await getFileName(path)
        if (event === 'add' || event === 'change') {
            templatesStore.templates[fileName] = await loadTemplate(path)
        }
        if (event === 'unlink') {
            delete templatesStore.templates[fileName]
        }
    }
}

window.electronAPI.registerFileChangedCallback(onFileChanged)
