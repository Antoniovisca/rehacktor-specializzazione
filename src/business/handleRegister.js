import { displayMessage, handleLog, isBlank, isValidEmail } from "./helper";
import { Store } from "./store";

/**
 * Funzione per gestire la registrazione utente
 */
export async function handleRegister(email, password, setLoading, setEmailStatus, setPasswordStatus, navigate) {
    let isRegistered = false;

    try {
        let validationFailed = false;

        if (!isValidEmail(email)) {
            setEmailStatus("error");
            validationFailed = true;
        }

        if (isBlank(password)) {
            setPasswordStatus("error");
            validationFailed = true;
        }

        if (validationFailed) {
            displayMessage("error", "Attenzione, compilare correttamente email e password");
            return;
        }

        setLoading(true);


        const { data, error } = await Store.supabase.auth.signUp({
            email: email.trim().toLowerCase(),
            password: password
        });

        if (error) {
            throw new Error(error.message);
        }

        console.log("Risposta registrazione:", data);

        if (data.user) {
            await Store.supabase.from("profiles").insert([
                {
                    id: data.user.id,
                    email: data.user.email,
                    created_at: new Date().toISOString()
                }
            ]);
        }

        isRegistered = true;

        
        if (!data.session) {
            displayMessage("success", "Registrazione completata! Controlla l’email per confermare l'account.");
        } else {
            displayMessage("success", "Registrazione completata! Accesso effettuato.");
            navigate("/");
        }

    } catch (e) {
        handleLog("error", "registerProvider.js", "handleRegister", e.message, [email, password]);
        displayMessage("error", "Errore durante la registrazione");
    } finally {
        setLoading(false);

        if (!isRegistered) {
            displayMessage("error", "Registrazione fallita");
        }
    }
}
