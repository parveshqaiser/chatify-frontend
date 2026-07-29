
export const BASE_URL = "http://localhost:7500/api/v1";

export let allowedDomains = ["@gmail.com", "@hotmail.com", "@yahoo.com"];

export let initialFormData = {
    username : "",
    name : "",
    email : "",
    password : ""
};

export let groups = [
		{ name: 'Design Weekly', creator: false },
		{ name: 'Frontend Guild', creator: true },
		{ name: 'Coffee & Code', creator: false },
		{ name: 'Book Club', creator: true },
	];

export let blockedUsers = ['spamdealer99', 'trolling_tom', 'fake_recruiter'];

