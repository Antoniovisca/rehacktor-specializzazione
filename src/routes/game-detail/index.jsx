import { useSearchParams } from "react-router-dom";
import Layout from "../../components/layout";
import { useEffect, useState } from "react";
import TopBar from "../../components/topBar";
import { getGameDetail } from "../../business/gameProvider";
import { Typography } from "antd";
const { Title, Text } = Typography;

export default function GameDetail(){

    const [params]              = useSearchParams();
    const [detail, setDetail]   = useState(null);

    useEffect(() => {
        
        const id = params.get('id');
        if(!id){
            window.location.href = "/";
            return;
        }
        
        getGameDetail(id)
        .then((jsonDetail) => {
            if(jsonDetail){
                setDetail(jsonDetail);
            }
        });

    }, []);

    return (
        <Layout>
            <TopBar hideSearch/>
            {
                detail ?
                    <div className="game-detail">
                        <Title>{detail.name}</Title>
                        <Text type="secondary">{detail.description_raw}</Text>
                    </div>
                :
                    <></>
            }
        </Layout>
    );
}