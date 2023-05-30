import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
    // backgroundLog: (callback) => ipcRenderer.on('log', callback),
    notify: (options) => ipcRenderer.send('notification:show', options),
    listenOn: (channel, func) => { // Taken from https://github.com/reZach/secure-electron-template/issues/43#issuecomment-772303787
        // Deliberately strip event as it includes `sender`
        const subscription = (event, ...args) => func(...args);
        ipcRenderer.on(channel, subscription);
        return () => {
          ipcRenderer.removeListener(channel, subscription);
        }
    },
    // onNotify: (callback) => ipcRenderer.on('notification:add', callback),
    closeSplashScreen: () => ipcRenderer.send('splashscreen:close'),
    openExternalLink: (link) => ipcRenderer.send('externallink:open', link),
    showItemInFolder: (filepath) => ipcRenderer.send('iteminfolder:open', filepath),
    openFileDialog: (options) => ipcRenderer.invoke('dialog:openFile', options),
    // onNewSolution: (callback) => ipcRenderer.on('menu:new-solution', callback),
    // onOpenFile: (callback) => ipcRenderer.on('menu:open-file', callback),
    // removeListeners: (channel) => ipcRenderer.removeAllListeners(channel),
    writeConfig: (data) => ipcRenderer.invoke('config:export', data),
    readConfig: () => ipcRenderer.invoke('config:import'),
    checkFileExt: (filepath) => ipcRenderer.invoke('file:check-path', filepath),
    joinPath: (...paths) => ipcRenderer.invoke('path:join', ...paths),
    resolvePath: (...paths) => ipcRenderer.invoke('path:resolve', ...paths),
    normalizePath: (filepath) => ipcRenderer.invoke('path:normalize', filepath),
    getAppPath: (name) => ipcRenderer.invoke('apppath:get', name),
    getAppLocaleCountryCode: () => ipcRenderer.invoke('applocalecountrycode:get'),
    logger: {
        editor: {
            silly: (log) => ipcRenderer.send('logger:log', 'silly', log, 'editor'),
            debug: (log) => ipcRenderer.send('logger:log', 'debug', log, 'editor'),
            info: (log) => ipcRenderer.send('logger:log', 'info', log, 'editor'),
            warn: (log) => ipcRenderer.send('logger:log', 'warn', log, 'editor'),
            error: (log) => ipcRenderer.send('logger:log', 'error', log, 'editor'),
        },
        parser: {
            silly: (log) => ipcRenderer.send('logger:log', 'silly', log, 'parser'),
            debug: (log) => ipcRenderer.send('logger:log', 'debug', log, 'parser'),
            info: (log) => ipcRenderer.send('logger:log', 'info', log, 'parser'),
            warn: (log) => ipcRenderer.send('logger:log', 'warn', log, 'parser'),
            error: (log) => ipcRenderer.send('logger:log', 'error', log, 'parser'),
        },        
        setLogLevelFile: (level) => ipcRenderer.send('logger:set-file-level', level),
        setLogLevelConsole: (level) => ipcRenderer.send('logger:set-console-level', level),
        getLogFilePaths: () => ipcRenderer.invoke('logger:get-filepaths'),
    },
    keytar: {
        setPassword: (account, password) => ipcRenderer.invoke('keytar:set-password', account, password),
        getPassword: (account) => ipcRenderer.invoke('keytar:get-password', account),
        deletePassword: (account) => ipcRenderer.invoke('keytar:delete-password', account)
    },
    changeTitle: (title) => ipcRenderer.send('title:set', title),
    setLanguage: (code) => ipcRenderer.send('language:set', code),
    copyTextToClipboard: (text) => ipcRenderer.send('clipboard:write-text', text),
    copyImageToClipboard: (nativeImage) => ipcRenderer.send('clipboard:write-text', nativeImage)
})