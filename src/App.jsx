
import './App.css'

import {BrowserRouter, Route, Routes} from "react-router-dom";
import LoginPage from './pages/LoginPage.jsx';
import RegistrationPage from './pages/RegistrationPage.jsx';
import PageNotFound from './pages/PageNotFound.jsx';


function App() {
	
	
	return(
		<BrowserRouter>
			<Routes>
				<Route index path='/' element={<LoginPage />}></Route>
				<Route index path='/login' element={<LoginPage />}></Route>
				<Route path='/signup' element={<RegistrationPage />}></Route>
				<Route path='*' element={<PageNotFound />}></Route>
			</Routes>
		</BrowserRouter>
	)
	
}

export default App;
