import { BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';

import About from './pages/About';
import Booking from './pages/Booking';

//select time and date
//user info 
import './App.css'; 

function AppContent() {

  


  return (
    <div className="App">
      <header>
        <div className='logo-div'>
          <img src="../assets/spa_logo.png" alt="Logo" className='logo-full' />
          <img src="../assets/O-small.png" alt="logo" className='logo-small' />
        </div>
        <nav id='navi'>
          <ul>
            <li><Link to="/" className='nav-page'>About</Link></li>
            <li><Link to="/book" className='nav-page'>Booking</Link></li>
          </ul>
        </nav>
      </header> 
      
  
      
      <Routes>
        <Route path="/" element={<About />} />
        <Route path="/book" element={<Booking />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
