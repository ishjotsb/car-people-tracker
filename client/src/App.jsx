import "./App.css";
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import HomePage from "./pages/HomePage";
import Person from "./pages/Person";

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/person/:id" element={<Person />} />
        </Routes>
      </BrowserRouter>
    </>
  )
  
}

export default App;
