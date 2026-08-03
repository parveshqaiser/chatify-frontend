
import React from 'react'

// used in login & signup
const Spinner = () => {
	return (
		<div className='text-center'>
			<span className="loading loading-spinner text-warning"></span>
		</div>
	)
}

export default Spinner;


// used in user profile component
export const LoadingMessage = () =>{
	return(
		<div className='flex justify-center items-center text-center'>
			<div className="loading loading-ball loading-xl"></div>
		</div>
	)
}