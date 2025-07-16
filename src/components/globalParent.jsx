import { message } from "antd";
import { useEffect } from "react";
import { Store } from "../business/store";

export default function GlobalParent({children}){
    
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        Store.messageApi = messageApi;
    }, []);

    return (
        <div className="animate__animated animate__fadeIn animate__faster">
            {contextHolder}
            {children}
        </div>
    );
}