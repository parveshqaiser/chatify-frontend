
export const BASE_URL = "http://localhost:7500/api";

export let allowedDomains = ["@gmail.com", "@hotmail.com", "@yahoo.com"];

export let escapeRegExp =(value)=> {
	return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export let platforms = [
    { value: "linkedin", label: "LinkedIn" },
    { value: "twitter", label: "Twitter" },
    { value: "facebook", label: "Facebook" },
    { value: "instagram", label: "Instagram" },
    { value : "github", label : "Git Hub"}
];

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

//  create group
const ALL_USERS = [
	{ id: 1, username: 'aarav_k' },
	{ id: 2, username: 'meera.j' },
	{ id: 3, username: 'rohan99' },
	{ id: 4, username: 'priya_s' },
	{ id: 5, username: 'devansh' },
	{ id: 6, username: 'ishaan_r' },
	{ id: 7, username: 'parveshq' },
	{ id: 8, username: 'bidi123' },
];

// Fetch group

export const GROUPS = [
    {
        _id: 'g1',
          avatar: { url: 'https://res.cloudinary.com/dp0v0zb7z/image/upload/v1790491803/group-photo/den9obtypdbxafwj1gts.jpg' },
        groupName: 'Weekend Trip',
        description: 'Planning the Coorg getaway',
        members: [
            { userId: 'u1', username: 'aarav_k' },
            { userId: 'u2', username: 'meera.j' },
            { userId: 'u3', username: 'rohan99' },
            { userId: 'u4', username: 'priya_s' },
            { userId: 'u5', username: 'devansh' },
        ],
        isActive: true,
        creator : true,
    },
    {
        _id: 'g2',
        avatar: { url: "https://res.cloudinary.com/dp0v0zb7z/image/upload/v1792768803/group-photo/eayssolc6uz1nafbmq1g.jpg"},
        groupName: 'Design Team',
        description: 'Figma links, feedback, memes',
        members: [
            { userId: 'u2', username: 'meera.j' },
            { userId: 'u6', username: 'ishaan_r' },
        ],
        isActive: true,
        creator : false,
    },
    {
        _id: 'g3',
        avatar: { url: '' },
        groupName: 'College Friends',
        description: null,
        members: [
            { userId: 'u1', username: 'aarav_k' },
            { userId: 'u3', username: 'rohan99' },
            { userId: 'u4', username: 'priya_s' },
            { userId: 'u5', username: 'devansh' },
            { userId: 'u6', username: 'ishaan_r' },
            { userId: 'u2', username: 'meera.j' },
            { userId: 'u7', username: 'kabir_m' },
        ],
        isActive: true,
        creator : true,
    },
    {
        _id: 'g4',
        avatar: { url: '' },
        groupName: 'Cricket Sunday',
        description: 'Ground booking & scores',
        members: [
            { userId: 'u3', username: 'rohan99' },
            { userId: 'u5', username: 'devansh' },
            { userId: 'u6', username: 'ishaan_r' },
        ],
        isActive: true,
        creator : false,
}];

