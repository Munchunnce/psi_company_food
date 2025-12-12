// import './App.css';
import { BrowserRouter, Route, Routes,  } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Cart from './pages/Cart';
import SingleProduct from './pages/SingleProduct';
import { Provider } from 'react-redux';
import store from './store/store';
import Register from './pages/Register';
import Login from './pages/Login';
import Products from './components/Products';
import ProtectedRoute from './components/ProductedRoute';
import Footer from './pages/Footer';

function App() {
  return (
    <div className="App">
      <Provider store={store}>
      <BrowserRouter>
          <Navigation/>
          <Routes>
            <Route path='/register' element={<Register/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/' exact element={<Home/>}/>
            <Route path='/products' exact element={<ProtectedRoute>
              <Products/>
            </ProtectedRoute>}/>
            <Route path='/products/:id' element={<SingleProduct/>}/>
            <Route path='/cart' element={<ProtectedRoute>
              <Cart/>
            </ProtectedRoute>}/>
          </Routes>
      <Footer/>
      </BrowserRouter>
      </Provider>
    </div>
  );
}

export default App;
