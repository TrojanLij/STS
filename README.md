<div id="top"></div>

<div align="center">
<pre>
     __  ____ _____ ____       __
    / / / ___|_   _/ ___|     / /
   / /  \___ \ | | \___ \    / / 
  / /    ___) || |  ___) |  / /  
 /_/    |____/ |_| |____/  /_/   
          Spam the scam           
</pre>
</div>

<div align="center">

<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

</div>

<div align="center">
     <b>This project has many bugs. If you want to help please report them!</b>
</div>

# About
This project was to combat and annoy Discord account hijackers by flooding their webhooks with fake information.

Yes we know we can simply shut a hook down via a simple _DELETE_ request, but where is the fun in that? So to have some fun **AND** annoy them, we took the original code of the virus and copied their design. So now instead of stealing and transmitting stolen credentials we are just sending randomly generated data to them at random intervals with their layout.

## Features
STS allows users to participate in a group to flood multiple scammer webhooks or webhooks extracted from malicious Discord code.

**This app is still in development. If an issue is found feel free to let us know.**
<!-- Lists of found or submitted webhooks are refreshed at user defined intervals and updated across the board so all users are up-to-date with found or closed webhooks. **_(we are still working on this part)_** -->

# Requirements

_For NodeJS requirements and package requirements read **package.json**._

# Installation
```bash
git clone https://(https://github.com/TrojanLij/spam-the-scam-bot.git)
cd spam-the-scam-bot
npm install
node .\app.js
```

## Basic usage:
To run the script simply execute:
```bash
node .\app.js
```

## Add Discord Bot token:
If the file was not created then just add a `conf.js` manually to the root of the folder.
To add a personalized bot token and use the bot Discord commands use:
```bash
node .\app.js token "YOUR TOKEN HERE"
```

## Add a scammer webhook to your local file:
If the file was not created then just add a `webhooks.json` manually to the root of the folder.
To add a webhook belonging to the scammers to your local webhook.json use the command:
```bash
node .\app.js add-hook "SCAMMER WEBHOOK HERE"
```

## Advanced configuration:
If you want to go rummaging around the code and are interested in any advanced configuration use the `conf.json` file.

<!-- # TODO
- [ ] Add a non-completed TODO list item. 
- [x] Add a completed TODO list item.
-->

## Important TODO:
- [x] Add ability to run even **WITHOUT** Discord bot token (why limit to bots only)
- [ ] Add pre-run self configuration and necessary file generation with instructions

## TODO Update:
- [x] Ability to add multiple webhooks that belong to hackers (get uploaded to a cdn)
- [ ] An initialization stage before everything runs (basic logic done)
- [ ] A random RR bc why the hell now
- [ ] Fetch every X seconds a list of scam webhooks
- [ ] If a 404 for WH, try again, if another 404, wait 60s then try last time.
- If last time 404 then return in reportHook *Tango down*

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/TrojanLij/spam-the-scam-bot.svg?style=for-the-badge
[contributors-url]: https://github.com/TrojanLij/spam-the-scam-bot/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/TrojanLij/spam-the-scam-bot.svg?style=for-the-badge
[forks-url]: https://github.com/TrojanLij/spam-the-scam-bot/network/members
[stars-shield]: https://img.shields.io/github/stars/TrojanLij/spam-the-scam-bot.svg?style=for-the-badge
[stars-url]: https://github.com/TrojanLij/spam-the-scam-bot/stargazers
[issues-shield]: https://img.shields.io/github/issues/TrojanLij/spam-the-scam-bot.svg?style=for-the-badge
[issues-url]: https://github.com/TrojanLij/spam-the-scam-bot/issues
[license-shield]: https://img.shields.io/github/license/TrojanLij/spam-the-scam-bot.svg?style=for-the-badge
[license-url]: https://github.com/TrojanLij/spam-the-scam-bot/blob/master/LICENSE.txt