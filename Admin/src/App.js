import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import '../src/assets/css/style.css'; // Adjust the path as per your file structure
import '../src/assets/css/Admin.css'; // Adjust the path as per your file structure
import Dashbord from './Pages/Dashbord';
import '@fortawesome/fontawesome-free/css/all.min.css';
import AllRoutes from './AllRoutes';
function App() {
  return (
    <>
    <AllRoutes/>
    </>
  );
}

export default App;
