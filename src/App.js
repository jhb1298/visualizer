
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from "./pagees/home"
import Code from "./pagees/code"
import LogIn from "./pagees/login"
import Reg from "./pagees/registration"


function Componenets(){
  return(
    <Routes>
      <Route exact path='/' element={<Home/>}/>
      <Route exact path='/log' element={<LogIn/>}/>
      <Route exact path='/reg' element={<Reg/>}/>
      <Route exact path='/code' element={<Code/>}/>
    </Routes>
  );
}


function App() {
  return (
    <div className="App">
      <Router>
        <Componenets/>
      </Router>
    </div>
  );
}

export default App;
