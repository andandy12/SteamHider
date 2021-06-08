const args = process.argv.slice(2);
const hasLoggedIn = false;
const SteamUser = require('steam-user');
const client = new SteamUser();
const SteamCommunity = require('steamcommunity');
const community = new SteamCommunity();
const ReadLine = require('readline');

const addField = (fieldsToAdd, field, fieldValue) => {
  if(fieldValue !== undefined && fieldValue !== null) {
    fieldsToAdd[field] = fieldValue;
  }
  return fieldsToAdd;
}

function askQuestion(query) {
    const rl = ReadLine.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    return new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans);
    }))
}

client.on('steamGuard', async function(domain, callback) {
	console.log("Steam Guard code needed from email ending in " + domain);
	var code = await askQuestion("Enter code from email: ");
	callback(code);
});

const SteamID = require('steamid'); // required to get accountID for checking if account is authed
// https://github.com/DoctorMcKay/node-steam-user/wiki/Family-Sharing Family Sharing Github Page

client.on('loggedOn', async function(details, parental) {
	var hasLoggedIn = true;
	console.log("\x1b[32mAccount successfully logged in\x1b[0m");

	const LocSteam64 = client.steamID.getSteamID64();
	console.log("\x1b[36mLocal SteamID64: ",LocSteam64,"\x1b[0m");
});
client.on('webSession', async function(sessionID, cookies) {
	await community.setCookies(cookies);

	//console.log(await community.getSessionID());
	const localSteam64 = community.steamID.getSteamID64().toString();
	console.log("Making Profile Private");
	const settings = { // set all information to friends only
		comments: "2",
		inventory: "2",
		inventoryGifts: true,
		gameDetails: "2",
		playtime: true,
		friendsList: "2"}
	community.profileSettings(settings);
	var maxTimePause = 35000,minTimePause = 20000;
	await hidenames(maxTimePause,minTimePause,localSteam64);
});

function sleep(ms) {
	return new Promise((resolve) => {
	  setTimeout(resolve, ms);
	});
}

async function hidenames(maxTimePause,minTimePause, localSteam64){
	if(fs.existsSync('RandomNames.txt')){
		var filedata = fs.readFileSync('RandomNames.txt','UTF-8');
		filedata = filedata.split(/\r?\n/);
	}else{
		fs.writeFileSync('RandomNames.txt',"You need to populate the RandomNames.txt file with names on seperate lines.");
		console.log("\x1b[5m\x1b[4m\x1b[5m\x1b[31mPOPULATE YOUR NEW RandomNames.txt FILE IN THE CURRENT DIRECTORY!\x1b[0m");
		filedata = ["Populate RandomNames.txt"];
		await askQuestion("");
		exit();
	}

	var newVanityURL,avatarlink,changeavatar;
	var maxTimePause = 35000,minTimePause = 20000;
	while(true){
		newVanityURL = 7+localSteam64.slice(0, -11).toString()+Math.floor((Math.random() * 7999999999) + 1000000000);
		let settings = {
			name:filedata[Math.floor((Math.random() * filedata.length) + 0)],
			realName:"",
			summary:"",
			country:"",
			state:"",
			city:"",
			customURL: newVanityURL,
		}
		console.log("Setting vanityURL to: \x1b[31m%s\x1b[0m",settings.customURL);
		console.log("Setting name to: \x1b[31m",settings.name,"\x1b[0m");
		community.editProfile(settings);
		community.clearPersonaNameHistory();
    console.log("\x1b[32mCleared previous Names\x1b[0m");
		if(changeavatar){
			avatarlink = "https://sguru.org/wp-content/uploads/2017/06/steam-avatar-profile-picture-0"+Math.floor((Math.random() * 334) + 100)+".jpg";
			console.log("Setting avatar: \x1b[31m",avatarlink,"\x1b[0m");
			await community.uploadAvatar(avatarlink);
			changeavatar = false;
		}else changeavatar = true;
		await sleep(Math.floor((Math.random() * (maxTimePause-minTimePause)) + minTimePause)); // set once every 20-35 seconds this will allow a maximum of 21600 per 24h
	}
}

const fs = require('fs');
const VDF = require('vdf');
const { exit } = require('process');

var sentryfile = fs.readFileSync("C:\\Program Files (x86)\\Steam\\config\\config.vdf").toString();
//console.log(sentryfile);
try{
	sentryfile = VDF.parse(sentryfile).InstallConfigStore.Software.Valve.Steam.SentryFile;
}catch(e){
	sentryfile = VDF.parse(sentryfile).InstallConfigStore.Software.Valve.steam.SentryFile;
  console.log("No sentryfile field found in config file... ");
}
const sentrybuffer = fs.readFileSync(sentryfile);
//console.log(sentrybuffer);
client.setSentry(sentrybuffer);
//console.log("\x1b[36m","Using Sentry: ", sentrybuffer,"\x1b[0m");
var user_config;
if(fs.existsSync('./account.json')){
	user_config = JSON.parse(fs.readFileSync('./account.json').toString());
	//console.log(user_config);
}else
	user_config = {username: "",password: ""};
(async () => {
	console.log("Press Ctrl+C to hault the program at any point!");
	if(!hasLoggedIn){
		if(args.length === 2){
			user_config.username = args[0];
			user_config.password = args[1];
		}
		if((user_config.username == "") || (user_config.password === "")){
			user_config.username = await askQuestion("Username: ");
			user_config.password = await askQuestion("Password: ");
			fs.writeFileSync('./account.json',JSON.stringify(user_config));
		}
		let details = {};
		addField(details, "accountName", user_config.username);
		addField(details, "password", user_config.password);
		addField(details, "rememberPassword", true);
		client.logOn(details);
	}
})();
