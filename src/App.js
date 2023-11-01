
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Code from "./pagees/code"


function Componenets(){
  return(
    <Routes>
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
