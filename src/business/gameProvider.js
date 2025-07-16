import { handleLog, isBlank } from "./helper";

/**
 * Ottiene tutti i giochi divisi
 * per pagina
 * @param {*} currentPage 
 * @returns 
 */
export async function getGames(currentPage, search = null){

    let json;
    try{

        const response = 
            await fetch(
                `${import.meta.env.VITE_RAWG_URL}/api/games?key=${import.meta.env.VITE_RAWG_KEY}&page=${currentPage}${!isBlank(search) ? `&search=${search.trim().toLowerCase()}` : ``}`
            );

        if(response.status == 200){
            json = await response.json();
        }

    }catch(e){
        handleLog("error", "gameProvider.js", "getGames", e.message, [currentPage]);
    }

    return json;
}

/**
 * Funzione iniziale per popolare
 * su più pagine i giochi
 * @param {*} pages 
 * @returns 
 */
export async function initialGameWrapper(pages){
    const n = Array.from({length: pages}, (i, k) => k);
    let json;
    for await (let i of n){
        const tempJson = await getGames(i + 1);
        if(!json){
            json = tempJson;
        }else{
            tempJson.results.forEach(r => json.results.push(r));
        }
    }
    return json;
}

/**
 * Ottieni i dettagli del gioco
 * @param {*} gameId 
 * @returns 
 */
export async function getGameDetail(gameId){

    let json;
    try{

        const response = 
            await fetch(
                `${import.meta.env.VITE_RAWG_URL}/api/games/${gameId}?key=${import.meta.env.VITE_RAWG_KEY}`
            );

        if(response.status == 200){
            json = await response.json();
        }

    }catch(e){
        handleLog("error", "gameProvider.js", "getGameDetail", e.message, [gameId]);
    }

    return json;
}