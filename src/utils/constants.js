
export const BASE_URL = "http://localhost:7500/api/v1";

export let allowedDomains = ["@gmail.com", "@hotmail.com", "@yahoo.com"];

export let escapeRegExp =(value)=> {
	return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}


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

export let users = [
	{ id: 1, name: "Yamal", online: true, avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRT0M9PkaDKnCMW8NANGmmvjkS-WhhsIOe4pQ&s" },
	{ id: 2, name: "Messi", online: true, avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRT0M9PkaDKnCMW8NANGmmvjkS-WhhsIOe4pQ&s" },
	{ id: 3, name: "Ronaldo", online: false, avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRT0M9PkaDKnCMW8NANGmmvjkS-WhhsIOe4pQ&s" },
	{ id: 4, name: "Bruno", online: false, avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRT0M9PkaDKnCMW8NANGmmvjkS-WhhsIOe4pQ&s" },
];

export const initialMessages = {
	1: [
		{ id: 1, text: "Are we still on for 6?", fromSelf: false },
		{ id: 2, text: "Yep, see you then", fromSelf: true },
	],
};

