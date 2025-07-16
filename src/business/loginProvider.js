import { displayMessage, handleLog, isBlank, isValidEmail } from "./helper";
import { Store } from "./store";

/**
 * Funzione per gestire il login.
 * Il parametro setLoading è la funzione che
 * aggiorna l'interfaccia per mostrare l'effetto
 * di caricamento sul pulsante "Accedi"
 * @param {*} email 
 * @param {*} password 
 * @param {*} setLoading 
 * @param {*} setEmailStatus 
 * @param {*} setPasswordStatus 
 * @param {*} navigate
 * @returns 
 */
export async function handleLogin(email, password, setLoading, setEmailStatus, setPasswordStatus, navigate){

    let isLogged = false;
    try{

        let validationFailed = false;

        if(!isValidEmail(email)){
            setEmailStatus("error");
            validationFailed = true;
        }

        if(isBlank(password)){
            setPasswordStatus("error");
            validationFailed = true;
        }

        if(validationFailed){
            displayMessage("error", "Attenzione, compilare correttamente email e password");
            return;
        }

        setLoading(true);

        // Tenta autenticazione con supabase
        const { data, error } =
            await Store.supabase.auth.signInWithPassword(
                {
                    email       : email.trim().toLowerCase(),
                    password    : password
                }
            );

        if(error){
            throw new Error(error);
        }
        
        isLogged = true;

    }catch(e){
        handleLog("error", "loginProvider.js", "handleLogin", e.message, [email, password]);
    }finally{
        
        if(!isLogged){
            setLoading(false);
            displayMessage("error", "Login fallito");
        }else{
            navigate("/");
        }

    }

}

/**
 * Logout dell'utente
 */
export async function logoOut(){
    const { error } = await Store.supabase.auth.signOut();
    return error;
}