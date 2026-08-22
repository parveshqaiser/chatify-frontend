
import './App.css'

import {BrowserRouter, Route, Router, Routes} from "react-router-dom";
import LoginPage from './pages/LoginPage.jsx';
import RegistrationPage from './pages/RegistrationPage.jsx';
import PageNotFound from './pages/PageNotFound.jsx';
import HomePage from './components/HomePage.jsx';
import UserProfile from './pages/UserProfile.jsx';
import EmailVerificatipnPage from './pages/EmailVerificatipnPage.jsx';

import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import appStore from './redux/store.js';
import ProtectedRoute from './components/ProtectedRoute.jsx';


function App() {
	

	return(
	<Provider store={appStore}>
		<BrowserRouter>
		<Toaster position='top-center' reverseOrder={false} />
			<Routes>
				<Route index path='/' element={<LoginPage />}></Route>
				<Route index path='/login' element={<LoginPage />}></Route>
				<Route path='/signup' element={<RegistrationPage />}></Route>
				<Route path='/register/success' element={<EmailVerificatipnPage />}></Route>

				<Route element={<ProtectedRoute />}>
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/profile" element={<UserProfile />} />
                </Route>

				<Route path='*' element={<PageNotFound />}></Route>
			</Routes>
		</BrowserRouter>
	</Provider>
	)
	
}

export default App;
