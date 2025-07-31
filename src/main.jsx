import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './routes/login';
import { ConfigProvider } from 'antd';
import { initSupabase } from './business/supabaseProvider';
import { Store } from './business/store';
import Dashboard from './routes/dashboard';
import 'animate.css';
import GameDetail from './routes/game-detail';
import RegisterRoute from './routes/signup';

console.log = () => {};
console.error = () => {};
console.debug = () => {};

initSupabase();

createRoot(document.getElementById('root')).
render(
  <ConfigProvider
    theme={
      {
        token: {
          colorPrimary: "#000",
          colorError: "#ab0202",
          borderRadius: "5px"
        }
      }
    }
  >
    {
      Store.supabase ? 
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Dashboard/>}></Route>
            <Route path='/game' element={<GameDetail/>}></Route>
            <Route path='/login' element={<Login/>}></Route>
            <Route path='/register' element={<RegisterRoute/>}></Route>
          </Routes>
        </BrowserRouter>
      :
        <div>
          Errore durante l'inizializzazione di supabase
        </div>
    }
  </ConfigProvider>
);
