import { useEffect, useState } from "react";
import { Store } from "../business/store";
import { isBlank, timestamp } from "../business/helper";
import { Button, Flex, Typography } from "antd";
import { PaperPlaneRightIcon } from "@phosphor-icons/react";
import { storeMessage } from "../business/supabaseProvider";
const { Text } = Typography;

export default function Chat(){

    const [render, setRender]   = useState(timestamp());
    const [message, setMessage] = useState(null);
    const [sending, setSending] = useState(false);
    
    useEffect(() => {
        Store.renderChatHook = setRender;
    }, []);

    useEffect(() => {
        const antDrawer = document.querySelector(".ant-drawer-body");
        if(antDrawer){
            const fullHeight = antDrawer.getBoundingClientRect().height;
            antDrawer.scrollTop = fullHeight + 100;
        }
    }, [render])

    return (
        <Flex gap={"10px"} className="chat-list" vertical>
            <div className="area-text">
                <textarea type="text" value={message ?? ""} onChange={(e) => setMessage(e.target.value)}></textarea>
            </div>
            <Button type="primary" className="send-button" disabled={isBlank(message)} onClick={async () => {
                setSending(true);
                let msg = message;
                setMessage(null);
                await storeMessage(msg);
                setSending(false);
            }} loading={sending}>
                Invia
                <PaperPlaneRightIcon/>
            </Button>
            {
                Store.messages.map((message, index) => 
                    <div key={"message-" + index.toString()} className={"chat"}>
                        <Text type="secondary">
                            {message.new.user_name}
                        </Text>
                        <div>
                            <Text>{message.new.message}</Text>
                        </div>
                    </div>
                )
            }
        </Flex>
    );
}