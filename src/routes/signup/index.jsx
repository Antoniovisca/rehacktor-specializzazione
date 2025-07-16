import { Button, Flex, Input, Typography } from "antd";
import Layout from "../../components/layout";
import { EnvelopeIcon, EyeClosedIcon, EyeIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { createUser } from "../../business/supabaseProvider";
import { displayMessage } from "../../business/helper";
import Logo from "../../components/logo";
const { Title } = Typography;

export default function RegisterRoute(){

    const [displayPassword, setDisplayPassword]                 = useState(false);
    const [displayRepeatPassword, setDisplayRepeatPassword]     = useState(false);
    const [email, setEmail]                                     = useState(null);
    const [password, setPassword]                               = useState(null);
    const [repeatPassword, setRepeatPassword]                   = useState(null);

    return (
        <Layout>
            <Flex vertical justify="center" align="center" style={{height: "100vh"}}>
                <Flex style={{width: "300px", background: "#fff", padding: "30px", boxShadow: "0px 0px 10px 0px #0000000d", borderRadius: "5px"}} gap={"15px"} align="center" vertical>
                    <Logo fontSize={"30px"}/>
                    <Input type="text" placeholder="Email" size="large" suffix={<EnvelopeIcon size={24}/>} onChange={(e) => {
                        setEmail(e.target.value);
                    }}></Input>
                    <Input 
                        type={!displayPassword ? "password" : "text"}
                        placeholder="Password" 
                        size="large" 
                        style={{cursor: "pointer"}}
                        suffix={
                            !displayPassword ? 
                                <EyeClosedIcon size={24} onClick={() => setDisplayPassword(true)}/>
                            :
                                <EyeIcon size={24} onClick={() => setDisplayPassword(false)}/>
                        }
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }}
                    ></Input>
                    <Input 
                        type={!displayRepeatPassword ? "password" : "text"}
                        placeholder="Ripeti password" 
                        size="large" 
                        style={{cursor: "pointer"}}
                        suffix={
                            !displayRepeatPassword ? 
                                <EyeClosedIcon size={24} onClick={() => setDisplayRepeatPassword(true)}/>
                            :
                                <EyeIcon size={24} onClick={() => setDisplayRepeatPassword(false)}/>
                        }
                        onChange={(e) => {
                            setRepeatPassword(e.target.value);
                        }}
                    ></Input>
                    <Button type="primary" style={{width: "300px"}} onClick={async () => {
                        if(email && password && repeatPassword){
                            if(password != repeatPassword){
                                displayMessage('error', "Le password non coincidono");
                                return;
                            }
                            const registered = await createUser(email, password);
                            if(!registered){
                                displayMessage('error', "Si è verificato un errore durante la registrazione");
                                return;
                            }
                            window.location.href = "/login";
                        }
                    }} id="signup">Registrati!</Button>
                </Flex>
            </Flex>
        </Layout>
    );
}