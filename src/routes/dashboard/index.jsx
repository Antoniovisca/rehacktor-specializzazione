import { useEffect, useState } from "react";
import Layout from "../../components/layout";
import TopBar from "../../components/topBar";
import { getGames, initialGameWrapper } from "../../business/gameProvider";
import GameCard from "../../components/gameCard";
import { isBlank, timestamp, waitRender } from "../../business/helper";
import { Drawer, Flex, Spin, Typography } from "antd";
import { Store } from "../../business/store";
import { getPreferred, listenChatMessages } from "../../business/supabaseProvider";
import FloatingChat from "../../components/floatingChat";
import Chat from "../../components/chat";
const { Title } = Typography;

let page        = 4;
let isLoading   = true;
let games       = [];
let search      = null;

export default function Dashboard(){

    const [_, setRender]                    = useState(timestamp());
    const [isOpenedChat, setIsOpenedChat]   = useState(false);

    useEffect(() => {

        if(!Store.subscribedOnChat){
            Store.subscribedOnChat = true;
            listenChatMessages(
                (newMessage) => {
                    console.log(newMessage)
                    Store.messages.push(newMessage);
                    if(Store.renderChatHook){
                        Store.renderChatHook(timestamp());
                    }
                }
            );
        }

        getPreferred()
        .then(value => {
            
            setRender(timestamp());

            initialGameWrapper(page)
            .then(
                (gameResponse) => {
                    
                    if(gameResponse && gameResponse.results && gameResponse.results.length > 0){
                        games = gameResponse.results;
                        isLoading = false;
                        setRender(timestamp());
                    }

                    waitRender(() => {

                        window.addEventListener(
                            'scroll',
                            (e) => {
                                
                                if(isLoading) return;
                                if(!isBlank(search)) return; 

                                const scrollTop         = window.scrollY;
                                const windowHeight      = window.innerHeight;
                                const documentHeight    = document.documentElement.scrollHeight;

                                if((scrollTop + windowHeight) >= (documentHeight - 5)){
                                    getGames(page + 1, search)
                                    .then(
                                        (gameResponse) => {
                                            if(gameResponse && gameResponse.results && gameResponse.results.length > 0){
                                                page++;
                                                const newGames = [...games, ...gameResponse.results];
                                                games = newGames;
                                                setRender(timestamp());
                                                waitRender(() => {
                                                    isLoading = false;
                                                });
                                            }
                                        }
                                    );
                                    isLoading = true;
                                    setRender(timestamp());
                                }

                            }
                        );

                    });

                }
            );

        });

    }, []);

    return (
        <Layout>
            <FloatingChat clickEvent={() => setIsOpenedChat(true)}/>
            <Drawer title="Chat" open={isOpenedChat} onClose={() => setIsOpenedChat(false)} destroyOnHidden={false}>
                <Chat/>
            </Drawer>
            <TopBar searchEvt={(e) => {
                let s = e;
                if(isBlank(e)){
                    s = null;
                }
                search = s;
                isLoading = true;
                page = 0;
                games = [];
                setRender(timestamp());
                getGames(page + 1, search)
                .then(
                    (gameResponse) => {
                        if(gameResponse && gameResponse.results && gameResponse.results.length > 0){
                            page++;
                            const newGames = [...games, ...gameResponse.results];
                            games = newGames;
                            setRender(timestamp());
                        }
                        waitRender(() => {
                            isLoading = false;
                        });
                    }
                );
            }}/>
            <div className="main-content">
                <Flex vertical>
                    <div className="game-list">
                        {
                            games.map(
                                (item, index) =>
                                    <GameCard key={`game-${index}`} gameObject={item}/>
                            )
                        }
                    </div>
                    {
                        isLoading &&
                        <div className="loading-bar animate__animated animate__fadeIn animate__faster">
                            <Spin size="large"></Spin>
                            <div>Attendi...</div> 
                        </div>
                    }
                </Flex>
            </div>
        </Layout>
    );
}