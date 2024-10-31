import { BrowserRouter ,Route,Routes} from 'react-router-dom';
import Analytic from './Pages/Analytic';
import Dashboard from './Pages/Dashboard';
import Home from './Pages/Home';
import Login from './Pages/Login';
import PageNotFound from './Pages/PageNotFound';
import PublicPage from './Pages/PublicPage';
import Setting from './Pages/Setting';
import './Style//App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PopupProvider } from './utils/TaskContext';
import ProtectedRoute from './Component/ProtectedRoute';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <PopupProvider>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/*' element={<ProtectedRoute  element= {Home} />} />
        <Route path="/sharetask/:slugID" element={<PublicPage />} />
      </Routes>
      </PopupProvider>
      </BrowserRouter>
      <ToastContainer />
    </div>
  );
}

export default App;
