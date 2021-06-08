# Profile Hider
Profile Hider is a node.js script based off the [node-steam-user](https://github.com/DoctorMcKay/node-steam-user) framework. It was created to easily hide and protect a persons profile from being watched through changing profile picture, vanity url, and profile picture.

## Installation
You must have [node.js](https://nodejs.org/en/) and [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) installed to install and run the script.
To check if these programs are installed you can run `node-v` and `npm -v`, if either of these commands cause a error or print a non-valid version number you must install them.
After npm is working properly in order to install all dependencies, run `npm i` in the same directory as `package.json`, alternatively you could run `install.bat` which will check if you have the required dependencies installed.
#### Prebuilt release
The release on the right side of the page was ran on `win10 x64 20H2` so results may vary on running the script. This prebuilt release was built using [pkg](https://www.npmjs.com/package/pkg), it does not require node.js or npm installed to run, to create an executable like this you could simply just run `buildAsPkg.bat`.
## Usage
To run the script you must run either of the below commands.

>npm run-script main
>
>node .\NameChangerV2.js

When prompted you must enter your username and password. Which will save the account details to a local file `.\account.json`. This is saved so that on the following runs you will not have to enter a username or password. Alternatively you can pass the username and password as arguments when running the command `node .\NameChangerV2.js <username> <password>`.

Next the program will start to hide your profile, all you have to do is wait and it will automatically every 30 seconds or so change your name and vanity url. It will also change your privacy settings at the start of the script.

To halt the program you must hit `Ctrl+C`, it may take two attempts.
## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

#### License
[ISC](https://choosealicense.com/licenses/isc/)
