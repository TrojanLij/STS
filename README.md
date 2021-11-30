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

</div>
<div align="center">

[![Discord][discord-shield]][discord-url]
<br /><i>-- <a href="https://discord.gg/kBdkUBywz6" target="_blank">https://discord.gg/kBdkUBywz6</a> --</i>
</div>

# About
This project was to combat and annoy Discord account hijackers by flooding their webhooks with fake information.

Yes we know we can simply shut a hook down via a simple _DELETE_ request, but where is the fun in that? So to have some fun **AND** annoy them, we took the original code of the virus and copied their design. So now instead of stealing and transmitting stolen credentials we are just sending randomly generated data to them at random intervals with their layout.

## Features
STS allows users to participate in a group to flood multiple scammer webhooks or webhooks extracted from malicious Discord code.

**This app is still in development. If an issue is found feel free to let us know.**
<!-- Lists of found or submitted webhooks are refreshed at user defined intervals and updated across the board so all users are up-to-date with found or closed webhooks. **_(we are still working on this part)_** -->

# Requirements
_For NodeJS requirements and package requirements read **package.json**. Or just run `npm i && npm run build`..._

# Installation
```bash
git clone https://github.com/TrojanLij/STS.git
cd STS
npm i
npm run build
npm start
```

## Instalation example
<div align="center">

[![Installing sts gif]][STSinstallGIF]

</div>

## Basic usage:
To run the script simply execute:
```bash
npm start
```

## Add Discord Bot token:
If the file was not created then just add a `conf.js` manually to the root of the folder.
To add a personalized bot token and use the bot Discord commands use:
```bash
npm start token "YOUR TOKEN HERE"
```

## Add a scammer webhook to your local file:
If the file was not created then just add a `webhooks.json` manually to the root of the folder.
To add a webhook belonging to the scammers to your local webhook.json use the command:
```bash
npm start add-hook "SCAMMER WEBHOOK HERE"
```

## Advanced configuration:
If you want to go rummaging around the code and are interested in any advanced configuration use the `conf.json` file.

<!-- # TODO
- [ ] Add a non-completed TODO list item. 
- [x] Add a completed TODO list item.
-->

## TODO Important:
- [x] Add ability to run even **WITHOUT** Discord bot token (why limit to bots only)
- [x] Added CLI runtime (@Lidcer you smart dude...)
- [ ] Fix some of the /commands
- [ ] @TrojanLij Learn to GIT!!!!

## TODO Update:
- [x] Ability to add multiple webhooks that belong to hackers
- [x] If a 404 for WH remove.

## TODO Discord bot /FEATURES/:
- [ ] **/HOOK/:**
  - [x] Discord `help` command to list all commands and usage 
  - [x] Add `cfg-hook` command category for local manipulation of config file / webhook list
    - [x] `cfg-hook-add` adds webhooks to local webhook.json
    - [x] `cfg-hook-remove` removes webhooks from local webhook.json
  - [x] `hook-close` sends DELETE request to webhook
  - [x] `check-hook` checks if it is a valid hook / returns HTTP status code
  - [x] `update-report-hook` updates report hook in webhooks.json 
  - [x] `close-hook` removes hook from local webhook.json if exists
  - [x] `test-embeds` displays all embeds
- [x] Add bot presence to display prefix

## TODO Later:
- [ ] A random RR bc why the hell now (added to *do later*)
- [ ] Fetch every X seconds a list of scam webhooks
- [ ] Add easy webhook list share feature
<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/TrojanLij/STS.svg?style=for-the-badge
[contributors-url]: https://github.com/TrojanLij/STS/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/TrojanLij/STS.svg?style=for-the-badge
[forks-url]: https://github.com/TrojanLij/STS/network/members
[stars-shield]: https://img.shields.io/github/stars/TrojanLij/STS.svg?style=for-the-badge
[stars-url]: https://github.com/TrojanLij/STS/stargazers
[issues-shield]: https://img.shields.io/github/issues/TrojanLij/STS.svg?style=for-the-badge
[issues-url]: https://github.com/TrojanLij/STS/issues
[license-shield]: https://img.shields.io/github/license/TrojanLij/STS.svg?style=for-the-badge
[license-url]: https://github.com/TrojanLij/STS/blob/main/LICENSE.txt
[discord-shield]: https://img.shields.io/discord/780429830184239144?label=Discord&style=for-the-badge
[discord-url]: https://discord.gg/kBdkUBywz6
[STSinstallGIF]: https://pluto.trojanlij.dev/installing-STS2.gif

