import { Card } from "antd";
import { useEffect, useState } from "react";
import { explodePlatforms } from "../business/helper";
import { HeartIcon, PlusIcon } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import { Store } from "../business/store";
import { removePreferred, setPreferredGame } from "../business/supabaseProvider";

export default function GameCard({gameObject}){

    const [platforms, setPlatforms]     = useState([]);
    const [isPreferred, setPreferred]   = useState(false);
    const navigate                      = useNavigate();

    useEffect(() => {
        
        const elapsedPlatformsIcons = explodePlatforms(gameObject.platforms);
        setPlatforms(elapsedPlatformsIcons);

        if(Store.preferreds.includes(gameObject.id)){
            setPreferred(true);
        }

    }, []);

    return (
        <Card 
            title={gameObject.name} 
            className="card-game animate__animated animate__fadeIn animate__faster"
        >
            <div className="card-image"
                onClick={() => {
                    navigate('/game?id=' + gameObject.id.toString());
                }}
            >
                <img src={gameObject.background_image} loading="lazy"/>
            </div>
            <div className="platforms">
                {
                    platforms.map((item, index) => 
                        <img src={item} className="platform-logo" key={`img-${index}`}/>
                    )
                }
            </div>
            <div className="critic">
                <div>
                    <b>Valutazione</b>
                </div>
                <PlusIcon/> 
                <div>{gameObject.metacritic ?? "0"}</div>
                <HeartIcon size={32} onClick={(e) => {
                    if(!Store.storedUser){
                        navigate("/login");
                        return;
                    }
                    setPreferred(!isPreferred);
                    if(!isPreferred){
                        setPreferredGame(gameObject.id);
                    }else{
                        removePreferred(gameObject.id);
                    }
                }} weight={isPreferred ? "fill" : "regular"}/>
            </div>
        </Card>
    );
}