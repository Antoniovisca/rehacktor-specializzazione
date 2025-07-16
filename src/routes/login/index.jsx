import { Button, Input } from "antd";
import Logo from "../../components/logo";
import { EnvelopeIcon, EyeClosedIcon, EyeIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { handleLogin } from "../../business/loginProvider";
import GlobalParent from "../../components/globalParent";
import { useNavigate } from "react-router-dom";
import { loggedUser } from "../../business/supabaseProvider";

export default function Login(){

    const [displayPassword, setDisplayPassword] = useState(false);    
    const [email, setEmail]                     = useState(null);
    const [password, setPassword]               = useState(null);
    const [loading, setLoading]                 = useState(false);
    const [emailStatus, setEmailStatus]         = useState(null);
    const [passwordStatus, setPasswordStatus]   = useState(null);
    const [renderize, setRenderize]             = useState(false);
    const navigate                              = useNavigate();

    useEffect(() => {

        loggedUser()
        .then(
            (userLogged) => {
                if(userLogged){
                    navigate("/");
                }else{
                    setRenderize(true);
                }
            }
        );

        function keyboardEvt(e){
            if(e.key && e.key.trim().toLowerCase() == "enter"){
                document.querySelector('.login-button').click();
            }
        }

        // Registra l'evento di click sulla tastiera
        // per login con click!
        window.addEventListener('keydown', keyboardEvt);

        // Rimuovi il login all'uscita della maschera
        return (() => { 
            window.removeEventListener('keydown', keyboardEvt);
        });

    }, []);

    return (
        renderize &&
        <GlobalParent>
            <div className="login-container">
                <div className="mask">
                    <Logo fontSize={"30px"}/>
                    <Input 
                        type="email" 
                        placeholder="Email" 
                        size="large" 
                        suffix={<EnvelopeIcon fontSize={24}/>} 
                        value={email} 
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setEmailStatus(null);
                        }}
                        status={emailStatus}
                    />
                    <Input 
                        type={!displayPassword ? "password" : "text"}
                        placeholder="Password" 
                        size="large" 
                        suffix={
                            !displayPassword ? 
                                <EyeClosedIcon fontSize={24} onClick={() => setDisplayPassword(true)}/>
                            :
                                <EyeIcon fontSize={24} onClick={() => setDisplayPassword(false)}/>
                        }
                        className="input-password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setPasswordStatus(null);
                        }}
                        status={passwordStatus}
                    />
                    <Button 
                        color="primary" 
                        variant="solid" 
                        size="large" 
                        className="login-button" 
                        loading={loading} 
                        onClick={() => handleLogin(email, password, setLoading, setEmailStatus, setPasswordStatus, navigate)}
                    >Accedi</Button>
                    <div style={{ marginTop: "10px" }} onClick={() => navigate("/register")}>
                        Non hai un account?{" "}
                        <span style={{ color: "#1677ff", cursor: "pointer", textDecoration: "underline" }}>
                            Registrati!
                        </span>
                    </div>
                </div>
            </div>
        </GlobalParent>
    );
}