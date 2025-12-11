// import './App.css';
import { BrowserRouter, Route, Routes,  } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Cart from './pages/Cart';
import SingleProduct from './pages/SingleProduct';
import { Provider } from 'react-redux';
import store from './store/store';

function App() {
  return (
    <div className="App">
      <Provider store={store}>
      <BrowserRouter>
          <Navigation/>
          <Routes>
            <Route path='/' exact element={<Home/>}/>
            <Route path='/products/:id' element={<SingleProduct/>}/>
            <Route path='/cart' element={<Cart/>}/>
          </Routes>
      </BrowserRouter>
      </Provider>
    </div>
  );
}

export default App;
