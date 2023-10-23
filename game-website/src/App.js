import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Main from './pages/homepage.js';
import User from './pages/user';
import Login from './pages/login';
import TicTacToe from './pages/TicTacToe';
import Checkers from './pages/checkers';
import ConnectFour from './pages/connect-four';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route index element={<Main />} />
          <Route path="/main" element={<Main />} />
          <Route path="/user" element={<User />} />
          <Route path="/login" element={<Login />} />
          <Route path="/TicTacToe" element={<TicTacToe />} />
          <Route path="/checkers" element={<Checkers />} />
          <Route path="/connect-four" element={<ConnectFour />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
