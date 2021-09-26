const saveBtn = document.querySelector("#save")
const shortcutToggleText = document.querySelector("#shortcut-toggle")
const shortcutToggleSetBtn = document.querySelector("#shortcut-toggle-set");
const shortcutToggleCancelBtn = document.querySelector("#shortcut-toggle-cancel");
let listenForShortcut = '';


function getSavedSettings(){
    return window.settings.get();
}

function getNewSettings(){
    let settings = getSavedSettings();
    document.querySelectorAll(".shortcut").forEach(setting => {
        if(!setting.id) return;

        settings[setting.id] = setting.value;
    })

    return settings;
}

function saveSettings(settings){
    window.settings.setAndRefreshShortcuts(JSON.stringify(settings));
}

function populateCurrentSettings(){
    const settings = getSavedSettings();

    Object.keys(settings).forEach(key => {
        try
        {
            document.querySelector("#" + key).value = settings[key];
        }
        catch(err){
            console.error(`Cannot populate setting: ${key}`)
        }
    })
}

function buildShortcutString(keyEvent){
    let parts = [];
    
    // https://www.electronjs.org/docs/api/accelerator
    if(keyEvent.metaKey) parts.push("Meta");
    if(keyEvent.altKey) parts.push("Alt");
    if(keyEvent.ctrlKey) parts.push("Ctrl");
    if(keyEvent.shiftKey) parts.push("Shift");

    parts.push(String.fromCharCode(keyEvent.keyCode));
    //parts.push(keyEvent.key.toUpperCase());
    return parts.join("+");
}


function enableShortcutListening(){
    listenForShortcut = 'shortcut-toggle';
    shortcutToggleCancelBtn.removeAttribute("disabled");
}

function disableShortcutListening(){
    listenForShortcut = '';
    shortcutToggleCancelBtn.setAttribute("disabled", "disabled");
}

function initShortcuts(){
    document.querySelector("BODY").addEventListener('keydown', function(e){
        if(!listenForShortcut) return;
        if(["Meta", "Shift", "Control", "Alt"].includes(e.key)) return;

        document.querySelector("#shortcut-toggle").value = buildShortcutString(e);
        disableShortcutListening();
    });

    shortcutToggleSetBtn.addEventListener('click', () => {
        enableShortcutListening();
    });

    shortcutToggleCancelBtn.addEventListener('click', () => {
        disableShortcutListening();
    });
}

function initSaveSettings(){
    saveBtn.addEventListener('click', () => {
        listenForShortcut = '';
        shortcutToggleCancelBtn.setAttribute("disabled", "disabled");

        let settings = getNewSettings();
        saveSettings(settings);
    });
}

function init(){
    populateCurrentSettings();
    initSaveSettings();
    initShortcuts();
}

init();