import './App.css';
import ChatBot from './ChatBot';
import Header from './Header';
import Home from './Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Menu from './Menu';
import Photo from './Photo';
import Temp from './Temp.js';

function App() {
  return (
    <div>
      <Router>
        {/* <Header /> */}
        <Routes>
          <Route exact path='/menu' Component={Menu} />
          <Route exact path='/chatBot' Component={ChatBot} />
          <Route exact path='/' Component={Photo} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
