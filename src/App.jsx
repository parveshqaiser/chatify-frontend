
import './App.css'

import {BrowserRouter, Route, Router, Routes} from "react-router-dom";
import LoginPage from './pages/LoginPage.jsx';
import RegistrationPage from './pages/RegistrationPage.jsx';
import PageNotFound from './pages/PageNotFound.jsx';
import HomePage from './components/HomePage.jsx';
import UserProfile from './pages/UserProfile.jsx';
import UserProfileGPT from './test/UserProfileGPT.jsx';
import UserProfileEditorial from './test/UserProfileEditorial.jsx';

// for testing
import TestHomePage1 from './test/Test.jsx';
import Fetch from './test/Fetch.jsx';
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import appStore from './redux/store.js';

function App() {
	
	
	return(
	<Provider store={appStore}>
		<BrowserRouter>
		<Toaster position='top-center' reverseOrder={false} />
			<Routes>
				<Route index path='/' element={<LoginPage />}></Route>
				<Route index path='/login' element={<LoginPage />}></Route>
				<Route path='/signup' element={<RegistrationPage />}></Route>
				<Route path='/home' element={<HomePage />}></Route>
				<Route path='/profile' element={<UserProfile />}></Route>
				<Route path="test/profile" element={<UserProfileGPT/>}></Route>
				<Route path="test/profile1" element={<UserProfileEditorial/>}></Route>

				{/* test */}
				<Route path='/home1' element={<TestHomePage1 />}></Route>
				<Route path='/api' element={<Fetch />}></Route>
				
				<Route path='*' element={<PageNotFound />}></Route>
			</Routes>
		</BrowserRouter>
	</Provider>
	)
	
}

export default App;
