import { Store } from "./store";

/**
 * E' una funzione che logga un evento
 * di errore o info
 * Ad oggi scrive in console, ma potrebbe
 * loggare anche su piattaforme terze
 * che monitorano i log
 * @param {*} level 
 * @param {*} file 
 * @param {*} message 
 */
export function handleLog(level, file, handler, message, params = []){
    
    if(level === "info"){
        console.log("[Rehacktor]", "Info log on", file, "function", handler);
        console.log(message);
    }else{
        console.error("[Rehacktor]", "Info log on", file, "function", handler);
        console.log(message);
    }

    // Logga i parametri per simulare eventuale errore
    params.map((item, index) => {
        console.log(`P${index + 1} => ${item}`);
    });

}

/**
 * Controlla se una stringa è null oppure vuota
 * @param {*} text 
 * @returns 
 */
export function isBlank(text){
    return !text || (text.trim() === "");
}

/**
 * Controlla la validità dell'email
 * @param {*} email 
 */
export function isValidEmail(email){
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

/**
 * Mostra a video un messaggio in
 * funzione del livello se di info
 * o di errore
 * @param {*} level 
 * @param {*} message 
 */
export function displayMessage(level, message){
    if(Store.messageApi){
        if(level === "info"){
            Store.messageApi.info(message);
        }else{
            Store.messageApi.error(message);
        }
    }
}

/**
 * Lavora tutte le piattaforme
 * per ottenere le icone
 * @param {*} platforms 
 * @returns 
 */
export function explodePlatforms(platforms){
    const icons = [];
    (platforms ?? []).forEach(p => {
        let platform = p.platform.name.trim().toLowerCase();
        if(platform.includes(" ")){
            platform = platform.split(" ")[0];
        }
        if(platform.includes("-")){
            platform = platform.split(".")[0];
        }
        if(platform == "macos"){
            platform = "ios";
        }
        if(platform == "ps" || platform == "psp"){
            platform = "playstation";
        }
        if(platform == "wii"){
            platform = "nintendo";
        }
        icons.push("/" + platform + ".png");
    });
    const noDuplicatedSet = new Set(icons);
    return [...noDuplicatedSet];
}

/**
 * Ottiene il timestamp,
 * utile per le funzioni di rendering forzate
 * @returns 
 */
export function timestamp(){
    return new Date().getTime();
}

/**
 * Attende il rendering
 * @param {*} func 
 */
export function waitRender(func, millisecond = 0){
    setTimeout(() => {
        func();
    }, millisecond);  
}