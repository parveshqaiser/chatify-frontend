
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

function App() {
	
	
	return(
		<BrowserRouter>
			<Routes>
				<Route index path='/' element={<LoginPage />}></Route>
				<Route index path='/login' element={<LoginPage />}></Route>
				<Route path='/signup' element={<RegistrationPage />}></Route>
				<Route path='/home' element={<HomePage />}></Route>
				<Route path='/profile' element={<UserProfile />}></Route>
				{/* <Route path="test/profile" element={<UserProfileGPT/>}></Route>
				<Route path="test/profile1" element={<UserProfileEditorial/>}></Route>
				<Route path="test/profile3" element={<GPT3/>}></Route> */}

				{/* test */}
				<Route path='/home1' element={<TestHomePage1 />}></Route>
				
				<Route path='*' element={<PageNotFound />}></Route>
			</Routes>
		</BrowserRouter>
	)
	
}

export default App;
