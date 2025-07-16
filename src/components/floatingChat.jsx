import { ChatIcon } from "@phosphor-icons/react";

export default function FloatingChat({clickEvent}){
    return (
        <div className="floating-chat" onClick={() => clickEvent()}>
            <ChatIcon/>
        </div>
    );
}