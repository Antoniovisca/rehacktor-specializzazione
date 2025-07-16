import { createClient } from "@supabase/supabase-js";
import { handleLog } from "./helper";
import { Store } from "./store";
import { v4 as uuidv4 } from "uuid";

/**
 * Effettuo l'init di supabase
 * @returns 
 */
export function initSupabase(){
    try{
        Store.supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_KEY);
    }catch(e){
        handleLog("error", "supabaseProvider.js", "initSupabase", e.message);
    }
}

/**
 * Controlla la presenza o meno di un utente
 * @returns 
 */
export async function loggedUser(){
    if(Store.storedUser) return Store.storedUser;
    let user;
    try{
        const { data } = await Store.supabase.auth.getUser();
        if(data){
            user = data.user;
            Store.storedUser = user;
        }
    }catch(e){
        handleLog("error", "supabaseProvider.js", "loggedUser", e.message);
    }
    return user;
}

/**
 * List messages on chat
 */
export function listenChatMessages(onNewMessage){

    try{

        console.log("Subscried to chat");

        Store.supabase.channel('chat-channel')
        .on(
            'postgres_changes',
            {
                event   : '*',
                schema  : 'public',
                table   : 'chat',
            },
            (payload) => {
                onNewMessage(payload);
            }
        )
        .subscribe();

    }catch(e){
        handleLog("error", "supabaseProvider.js", "listenChatMessages", e.message);
    }

}

/**
 * Sava messaggio
 * @param {*} userName 
 * @param {*} guid 
 * @param {*} message 
 */
export async function storeMessage(message){

    try{

        const user = await loggedUser();

        await Store.supabase.from('chat')
        .insert(
            [
                {
                    'user_name' : user && user.email ? user.email : "Guest",
                    'guid_user' : user && user.id ? user.id : uuidv4(),
                    'message'   : message
                }
            ]
        )

    }catch(e){
        handleLog("error", "supabaseProvider.js", "storeMessage", e.message);
    }

}

/**
 * Imposta preferito
 * @param {*} idGame 
 */
export async function setPreferredGame(idGame){

    try{

        const user  = await loggedUser();
        const id    = user.id;

        const response = 
            await Store.supabase.from('preferred')
            .insert(
                [
                    {
                        "id_game"   : idGame,
                        "guid_user" : id
                    }
                ]
            );

    }catch(e){
        handleLog("error", "supabaseProvider.js", "setPreferred", e.message);
    }

}

/**
 * Rimuovi dai preferiti
 * @param {*} idGame 
 */
export async function removePreferred(idGame){

    try{

        const user  = await loggedUser();
        const id    = user.id;

        await Store.supabase.from('preferred').delete().eq('id_game', idGame).eq('guid_user', id);

    }catch(e){
        handleLog("error", "supabaseProvider.js", "removePreferred", e.message);
    }

}

/**
 * Ottieni preferiti a partire dal guid dell'utente
 */
export async function getPreferred(){

    Store.preferreds = [];
    try{

        const user  = await loggedUser();
        const id    = user.id;

        const { data, error } = await Store.supabase.from('preferred').select('*').eq('guid_user', id);
        data.forEach(d => {
            Store.preferreds.push(d.id_game);
        });
        console.log(Store.preferreds);

    }catch(e){
        handleLog("error", "supabaseProvider.js", "getPreferred", e.message);
    }

}

/**
 * Crea utente
 * @param {*} email 
 * @param {*} password 
 * @returns 
 */
export async function createUser(email, password){

    let registered = false;
    try{

        const { data, error } = 
            await Store.supabase.auth.signUp(
                {
                    "email"     : email,
                    "password"  : password
                }
            );
        console.log(error);

        if(!error){
            registered = true;
        }

    }catch(e){
        handleLog("error", "supabaseProvider.js", "createUser", e.message);
    }   

    return registered;
}