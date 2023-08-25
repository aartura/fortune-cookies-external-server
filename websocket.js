const ws = require("ws");

const API = "http://yerkee.com/api/fortune";
const wss = new ws.Server(
	{
		port: 5000,
	},
	() => console.log("Server started on 5000"),
);

const fetchFortuneCookie = async () => {
	const response = await fetch(API);
	const cookie = await response.json();
	return cookie?.fortune;
};

wss.on("connection", function connection(ws, req) {
	const messageInterval = setInterval(async () => {
		const data = await fetchFortuneCookie();
		const cookie = {
			fortune: data,
			id: Date.now(),
			date: Date.now(),
		};

		ws.send(JSON.stringify(cookie));
	}, 5000);

	ws.on("close", () => {
		console.log("Client disconnected");
		clearInterval(messageInterval);
	});
});
