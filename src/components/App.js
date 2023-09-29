import './App.css';
import ChatBot from './ChatBot';
import Header from './Header';
import Home from './Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Menu from './Menu';
import FormsList from './FormsList';

function App() {
  return (
    <div>
      <Router>
        <Header />
        <Routes>
          <Route exact path='/formsList' Component={FormsList} />
          <Route exact path='/menu' Component={Menu} />
          <Route exact path='/chatBot' Component={ChatBot} />
          <Route exact path='/' Component={Home} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
