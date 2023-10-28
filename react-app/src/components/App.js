import './App.css';
import ChatBot from './ChatBot';
import Header from './Header';
import Home from './Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Menu from './Menu';
import FormsList from './FormsList';
import { React, Component } from 'react';
import './OCR.css';
import MarkTemp from './MarkTemp';
import Login from './Login';
import PrevTemplates from './PrevTemplates';
import ShowTemplate from './ShowTemplate';
import ShowData from './ShowData';
import GetData from './GetData';
import PersistentDrawerLeft from './PersistentDrawerLeft';
import ViewData from './ViewData';
import NewTemplateMenu from './NewTemplateMenu';
import AddChatbotFields from './AddChatbotFields';
import CreateFormEntry from './CreateFormEntry';


class App extends Component {
  constructor() {
    super();
    this.state = {
      loggedin: localStorage.getItem("username"),
      selected: null
    };
  }

  // Function to update the selected variable
  updateSelected = (newValue) => {
    this.setState({ selected: newValue });
  }
  render() {
    let dict = {};
    if (this.state.loggedin == null) {
      dict['Signup/Login'] = '/login';
    }
    else {
      dict['Mark Template'] = '/marktemp';
      dict['Get Data'] = '/getdata';
      dict['Previous Templates'] = '/prevtemplates';
      dict['Back to Menu'] = '/menu';
    }

    return (
      <div>
        <Router>
          <Routes>
            <Route exact path='/login' component={Login} />
            <Route exact path='/marktemp' element={<>
              <PersistentDrawerLeft options={dict} />
              <MarkTemp />
            </>}>
            </Route>
            <Route exact path='/prevtemplates' element={<>
              <PersistentDrawerLeft options={dict} />
              <PrevTemplates />
            </>}>
            </Route>
            <Route exact path='/template' element={<>
              <PersistentDrawerLeft options={dict} />
              <ShowTemplate />
            </>}>
            </Route>
            <Route exact path='/data' element={<>
              <PersistentDrawerLeft options={dict} />
              <ShowData />
            </>}>
            </Route>
            <Route exact path='/getdata' element={<>
              <PersistentDrawerLeft options={dict} />
              <GetData />
            </>}>
            </Route>
            <Route exact path='/viewdata' element={<>
              <PersistentDrawerLeft options={dict} />
              <ViewData />
            </>}>
            </Route>
            <Route exact path='/formsList' element={<>
              <Header />
              <FormsList />
            </>}>
            </Route>
            <Route exact path='/createFormEntry' element={<>
              <Header />
              <CreateFormEntry />
            </>}>
            </Route>
            <Route exact path='/createNewTemplate' element={<>
              <Header />
              <NewTemplateMenu />
            </>}>
            </Route>
            <Route exact path='/addChatbotFields' element={<>
              <Header />
              <AddChatbotFields />
            </>}>
            </Route>
            <Route exact path='/menu' element={<>
              <Header />
              <Menu />
            </>}>
            </Route>
            <Route exact path='/chatBot' element={<>
              <Header />
              <ChatBot />
            </>}>
            </Route>
            <Route exact path='/' element={<>
              <Header />
              <Home />
            </>}>
            </Route>
          </Routes>
        </Router>
      </div>
    );
  }
}

export default App;