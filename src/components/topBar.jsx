import { Avatar, Button, Dropdown, Flex, Input, Popover, Select, Typography } from "antd";
import Logo from "./logo";
import { CaretLeftIcon, FunnelIcon, MagnifyingGlassIcon, SortAscendingIcon, XIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { loggedUser } from "../business/supabaseProvider";
import { useNavigate } from "react-router-dom";
import { logoOut } from "../business/loginProvider";
import { isBlank } from "../business/helper";
const { Text } = Typography;

export default function TopBar({hideSearch, searchEvt}){

    const [isLoadingUser, setIsLoadingUser] = useState(true);
    const [user, setUser]                   = useState(false);
    const [search, setSearch]               = useState(null);
    const navigate                          = useNavigate();

    useEffect(() => {

        loggedUser()
        .then(
            (userLogged) => {
                setIsLoadingUser(false);
                if(userLogged){
                    setUser(userLogged);
                }
            }
        );

    }, []);

    return (
        <div className="container-top-bar">
            <div className="top-bar">
                <Flex gap={"20px"} align="center" onClick={() => {
                    if(hideSearch){
                        navigate(-1);
                    }
                }}>
                    {
                        hideSearch ? 
                            <CaretLeftIcon size={32}/>
                        :
                            <></>
                    }
                    <Logo fontSize={"25px"}/>
                    {
                        !hideSearch ?
                            <>
                                <Input type="text" placeholder="Ricerca..." variant="filled" size="large" className="search-bar" value={search} onChange={(e) => setSearch(e.target.value)}/>
                                <Button size="large" type="primary" onClick={() => {
                                    searchEvt(search);
                                }}><MagnifyingGlassIcon size={20}/></Button>
                                {
                                    !isBlank(search) ? 
                                        <Button onClick={() => {
                                            setSearch(null);
                                            searchEvt(null);
                                        }} size="large">
                                            <XIcon size={20}/>
                                        </Button>
                                    :
                                        <></>
                                }
                            </>
                        :
                            <></>
                    }
                </Flex>
                {
                    !isLoadingUser ? 
                        user ?
                            <Flex gap={"15px"} align="center">
                                <Flex vertical align="end">
                                    <Text>{user.email}</Text>
                                    <Text type="secondary" className="id-avatar">{user.id}</Text>
                                </Flex>
                                <Popover title="Sicuro di voler uscire?" content={<Button onClick={async () => {
                                    const error = await logoOut();
                                    if(!error){
                                        window.location.reload();
                                    }
                                }}>Si, procedi</Button>}>
                                    <Button type="primary">Esci</Button>
                                </Popover>
                            </Flex>
                        :
                            <Button size="large" type="primary" onClick={() => navigate('/login')}>Accedi</Button>
                    :
                        <></>
                }
            </div>
        </div>
    );
}