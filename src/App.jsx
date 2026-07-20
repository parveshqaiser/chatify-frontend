
import './App.css'

import {BrowserRouter, Route, Routes} from "react-router-dom";
import LoginPage from './pages/LoginPage.jsx';
import RegistrationPage from './pages/RegistrationPage.jsx';
import PageNotFound from './pages/PageNotFound.jsx';
import HomePage from './components/HomePage.jsx';
import TestHomePage1 from './test/Test.jsx';

function App() {
	
	
	return(
		<BrowserRouter>
			<Routes>
				<Route index path='/' element={<LoginPage />}></Route>
				<Route index path='/login' element={<LoginPage />}></Route>
				<Route path='/signup' element={<RegistrationPage />}></Route>
				<Route path='/home' element={<HomePage />}></Route>

				{/* test */}
				<Route path='/home1' element={<TestHomePage1 />}></Route>
				
				<Route path='*' element={<PageNotFound />}></Route>
			</Routes>
		</BrowserRouter>
	)
	
}

export default App;
