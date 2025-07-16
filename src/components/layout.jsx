import { useEffect } from "react";
import GlobalParent from "./globalParent";

export default function Layout({children}){

    useEffect(() => {

    }, []);

    return (
        <GlobalParent>
            {children}
        </GlobalParent>
    );
}