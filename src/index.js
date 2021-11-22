require("dotenv").config();
const { Client, Intents } = require("discord.js");
const _ = require("lodash");
const fs = require("fs");
const { token, ignoreErrors, prefix } = require("../conf.json");
const { scamHookUrls, reportHookUrl } = require("../webhooks.json");
const { getUserLogonEmbed } = require("./userLoginEmbed");
const { getUserPasswordChangeEmbed } = require("./userPasswordChangeEmbed");
const { getCreditCardEmbed } = require("./creditCardAddedEmbed");
const { emailChangeEmbed } = require("./emailChangeEmbed");
const { firstTimeEmbed } = require("./firstTimeEmbed");
const {
  convertTimestamp,
  generateRandomProfileWithPic,
  delay,
  DEVELOPMENT,
  warpTripleQuote,
  wiggleNumber,
} = require("./utils");
const { MINUTE, SECOND } = require("./constants");
const { default: axios } = require("axios");
const { createCommandHandler } = require("./commandUtils");
const moment = require("moment");
const { writeError } = require("./log");

let sent = 0;
let failed = 0;
let scamWebhooks = [];
let reportWebhook = ""; // report webhook?
let multiplyTimer = 1;

const startTime = Date.now();
const socketRetries = new Map();
let signature = {};

async function startUserMonitor(webhook) {
  // function is made in a way that keeps user profile through its life time
  // which should prevent easily searching the ids as the embeds are connected together
  const profile = await generateRandomProfileWithPic();

  // we first send message that injector succeeded
  await send(webhook, await firstTimeEmbed(profile));
  DEVELOPMENT && console.log(`Sent Discord Initalized ${profile.tag}`);

  // we wait a bit then we send user login
  await delay(MINUTE * 2 * multiplyTimer, MINUTE * 5 * multiplyTimer);
  await send(webhook, await getUserLogonEmbed(profile));
  DEVELOPMENT && console.log(`Sent User logon ${profile.tag}`);

  // as an example user will later realized that they got a virus and will try to change password
  if (_.random(0, 3)) {
    await delay(MINUTE * 10 * multiplyTimer, MINUTE * 20 * multiplyTimer);
    await send(webhook, await getUserPasswordChangeEmbed(profile));
    DEVELOPMENT && console.log(`Sent Password change ${profile.tag}`);
  }

  if (!_.random(0, 5)) {
    await delay(MINUTE * 10 * multiplyTimer, MINUTE * 20 * multiplyTimer);
    await send(webhook, await emailChangeEmbed(profile));
    DEVELOPMENT && console.log(`Email change ${profile.tag}`);
  }

  // User might add card late. Timer should be larger but it really depends on amount of request that we are sending
  if (!_.random(0, 5)) {
    await delay(MINUTE * 10 * multiplyTimer, MINUTE * 20 * multiplyTimer);
    await send(webhook, await getCreditCardEmbed(profile));
    DEVELOPMENT && console.log(`Sent Credit card added ${profile.tag}`);
  }

  //TODO : Should probably add logout method or something
}

async function send(webhook, data) {
  try {
    await axios.post(webhook, data);
    multiplyTimer = _.clamp(
      multiplyTimer - multiplyTimer * 0.1,
      1,
      Number.MAX_SAFE_INTEGER
    );
    sent++;
  } catch (error) {
    const TO_MANY_REQUESTS_ERROR = 429;
    const NOT_FOUND = 404;
    if (error?.response?.status === TO_MANY_REQUESTS_ERROR) {
      multiplyTimer *= 1.5; // auto slow down requests
    }
    if (error?.response?.status === NOT_FOUND && !ignoreErrors) {
      let number = socketRetries.get(webhook) || 0;
      number++;
      if (number > 5) {
        const index = scamWebhooks.indexOf(webhook);
        scamWebhooks.splice(index, 1);
        if (scamWebhooks.length) {
          await axios
            .post(reportWebhook, {
              ...signature,
              content: `Removing <${webhook}> from the list because it is inaccessible!`,
            })
            .catch(console.error);
        } else {
          const sum = [
            `${sent}(sent)`,
            `${failed}(failed)`,
            `${sent + failed}(total)`,
          ].join("\n");
          await axios
            .post(reportWebhook, {
              ...signature,
              content: `Stopping the app because all the webhooks are inaccessible.\n${sum}`,
            })
            .catch(console.error);
          process.exit(0);
        }
        socketRetries.delete(webhook);
      }
    }
    socketRetries.delete(webhook);
    if (!ignoreErrors) {
      failed++;
      console.error("Unable to send", data);
      const errorMsg = await writeError(error, data);
      axios
        .post(reportWebhook, { ...signature, content: errorMsg })
        .catch(console.error);
    }
  }
}

function instancesSpawner(n) {
  if (DEVELOPMENT) {
    startUserMonitor(reportWebhook);
  }
  const range = MINUTE * 10;
  const value = range / n;
  for (let i = 0; i < n; i++) {
    const recursion = () => {
      startUserMonitor(_.sample(scamWebhooks));
      setTimeout(recursion, wiggleNumber(range, value));
    };
    const time = Math.abs(wiggleNumber(value * i, value));
    setTimeout(recursion, time);
  }
}

function start(instances) {
  switch (process.env.NODE_ENV) {
    case "production":
      scamWebhooks = scamHookUrls;
      reportWebhook = reportHookUrl;
      console.log(`Started in NODE_ENV: ${process.env.NODE_ENV}`);
      break;
    default:
      scamWebhooks = [reportHookUrl];
      reportWebhook = reportHookUrl;
      console.log(`Started in NODE_ENV: ${process.env.NODE_ENV}`);
      break;
  }
  instancesSpawner(instances);
}

async function startUpDiscordBot(token) {
  const client = new Client({
    intents: [
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_WEBHOOKS,
      Intents.FLAGS.GUILD_MESSAGES,
    ],
  });
  try {
    await client.login(token);
  } catch (error) {
    return error;
  }

  let last = "";
  setInterval(() => {
    const gen = `Sent ${sent} request | ${prefix}help`;
    if (last === gen) {
      return;
    }
    last = gen;
    if (client.user) {
      client.user.setPresence({
        activities: [
          {
            name: last,
            type: "PLAYING",
          },
        ],
        status: "dnd",
      });
    }
  }, SECOND * 15);

  client.once("ready", async () => {
    console.info(`Discord bot started as "${client.user.tag}"`);
    signature = {
      username: client.user.tag,
      avatar_url: client.user.avatarURL({format: 'png'}),
    }

  });
  const commands = createCommandHandler(client, prefix || "!");
  commands.createCommand(["homo"], "Display info", (_, reply) => {
    reply({
      embeds: [
        {
          title: "HOMO REQUESTED",
          color: "ff00ff",
          fields: [
            {
              name: "Start Time:",
              value: `\`\`\`${convertTimestamp(startTime)}\`\`\``,
              inline: false,
            },
            {
              name: "Running for:",
              value: `\`IDK I don't do math\``, // I am gonna leave this in @Lidcer
              inline: true,
            },
            {
              name: "Started",
              value: moment(startTime).fromNow(),
              inline: true,
            },
            {
              name: "How many messages? *(to little)*",
              value: `\`${sent}\``,
              inline: false,
            },
            {
              name: "Failed request? *(oh no)*",
              value: `\`${failed}\``,
              inline: true,
            },
            {
              name: "Count hooks",
              value: `\`${scamWebhooks.length}\``,
              inline: true,
            },
          ],
          image: {
            url: "https://c.tenor.com/TJiQDMvpWuoAAAAC/itsascam-scam.gif",
          },
          author: {
            name: "Bill Clinton",
          },
          footer: {
            text: "Fucking with scammers since 99",
          },
        },
      ],
    });
  });

  const options = [
    "password-change",
    "email-change",
    "credit-card",
    "user-logon",
  ];

  commands.createCommand(
    ["test"],
    "Test the bot",
    async (args, replay) => {
      const index = args[0] || _.sample(options);
      try {
        switch (index) {
          case "password-change":
            await replay(await getUserPasswordChangeEmbed());
            break;
          case "email-change":
            await replay(await emailChangeEmbed());
            break;
          case "credit-card":
            await replay(await getCreditCardEmbed());
            break;
          case "user-logon":
            await replay(await getUserLogonEmbed());
            break;
          default:
            await replay(await firstTimeEmbed());
            break;
        }
      } catch (error) {
        console.error(error);
        await replay(error.message);
      }
    },
    [
      {
        name: "type",
        description: "type of embed",
        required: false,
        choices: options,
      },
    ]
  );

  commands.createCommand(["rr"], "Sends mysterious qrcode", (_, reply) => {
    reply(
      warpTripleQuote(
        [
          `█████████████████████████████████`,
          `█████████████████████████████████`,
          `████ ▄▄▄▄▄ █ ██▀▀ ▄▄ █ ▄▄▄▄▄ ████`,
          `████ █   █ █  ▀█▄█▀█▀█ █   █ ████`, // Never gonna give you up
          `████ █▄▄▄█ █▀  █▄ ▀▄▀█ █▄▄▄█ ████`,
          `████▄▄▄▄▄▄▄█▄█ ▀▄█ ▀▄█▄▄▄▄▄▄▄████`, // Never gonna let you down
          `████▄ ▀▀ ▄▄█▀█▄██▀█▀▀██▄▀ ▄ ▄████`,
          `█████▄▀█▀▀▄▄▄ ▄▄▄▄ ▄ █ ▄▀▄ ▀█████`, // Never gonna run around and desert you
          `████▀ █▄▀▄▄  ▀▀▀▄▀▄▀▀ ▄█▀▄▄ ▄████`,
          `██████▀▀█ ▄█▀ ▀ ██▄▄▄██  ▄ ▀█████`, // Never gonna make you cry
          `████▄▄█▄▄█▄▄▀ ▀▄█▀█▄ ▄▄▄ ▄▄██████`,
          `████ ▄▄▄▄▄ █▀▀▄▄ ▄ ▀ █▄█ ▀▀▀█████`, // Never gonna say goodbye
          `████ █   █ █▄▄█▀▄█▄▀▄   ▄▄  ▀████`,
          `████ █▄▄▄█ █▀ ▄▄ █▀█▄█▄▀▀ ▀ █████`, // Never gonna tell a lie and hurt you
          `████▄▄▄▄▄▄▄█▄█▄██▄█▄██▄███▄▄▄████`,
          `█████████████████████████████████`,
          `█████████████████████████████████`,
        ].join("\n")
      )
    );
  });

  commands.createCommand(
    ["test-life-time"],
    "Send lifetime example",
    async (_, reply) => {
      await send(reportHookUrl, "Sending....");
      const profile = await generateRandomProfileWithPic();
      await send(reportHookUrl, await firstTimeEmbed(profile));
      await send(reportHookUrl, await getUserLogonEmbed(profile));
      await send(reportHookUrl, await getUserPasswordChangeEmbed(profile));
      await send(reportHookUrl, await emailChangeEmbed(profile));
      await send(reportHookUrl, await getCreditCardEmbed(profile));
      reply("done");
    }
  );

  commands.createCommand(["count"], "Count webhooks", (_, reply) => {
    reply(`Count of scam hooks is: ${scamWebhooks.length}`);
  });

  commands.createCommand(
    ["shut-hook"],
    "Sends DELETE request to hook",
    async (args, reply) => {
      await reply(`Requesting status for *${args.length}* hooks.`);
      for (let i = 0; i < args.length; i++) {
        if ((await checkHook(args[i])) != 404) {
          reply(`${await shutHook(args[i])}`);
        } else {
          reply(`404`);
        }
      }
    },
    [{ name: "url", description: "Will send DELETE request to the hooker", required: true }]
  );

  commands.createCommand(
    ["check-hook"],
    "Check for hook",
    async (args, reply) => {
      for (let i = 0; i < args.length; i++) {
        reply(`Hook ${i + 1} returned: Status *${await checkHook(args[i])}*`);
      }
    },
    [
      {
        name: "url",
        description: "Will return status of the hooker",
        required: true,
      },
    ]
  );

  commands.createCommand(
    ["add-hook"],
    "Add for hook",
    async (args, reply) => {
      const readWH = fs.readFileSync("./webhooks.json");
      let readData = JSON.parse(readWH);
      for (let i = 0; i < args.length; i++) {
        try {
          let check = await checkHook(args[i]);
          if (check == 200 ){
            // returned HTTP 200
            readData.scamHookUrls.push(args[i]);
          } else {
            reply(`Hook ${i + 1} returned: Status *${check}*`);
          }
        } catch (error) {
          console.log(`Something went wrong ${error}`);
        }
      }
      
      try {
        fs.writeFileSync("./webhooks.json", JSON.stringify(readData, undefined, 2));
        if(process.env.NODE_ENV == 'production'){
          scamWebhooks = readData.scamHookUrls;
        }
        reply(`updated scam webhook list`);
      } catch (error) {
        console.log(error);
      }
    },
    [
      {
        name: "hook",
        description: "Will add the hooker to the list",
        required: true,
      },
    ]
  );

  // commands.createCommand(
  //   ["whois"],
  //   "Check URL WHOIS information",
  //   async (args, reply) => {
  //     for (let i = 0; i < args.length; i++) {
  //       let result = await whoIsPromise(args[i]);
  //       const array = result.match(/.{1,2000}/g);
  //       for(let m of array) {
  //           await reply(m);
  //       }
  //     }
  //   },
  //   [
  //     {
  //       name: "whois",
  //       description: "Will return WHOIS information of the URL",
  //       required: true,
  //     },
  //   ]
  // );

  commands.initSlashCommands();
}

async function checkHook(webhook) {
  try {
    const result = await axios.get(webhook);
    return result.status; // 200
  } catch (error) {
    return error; // 404
  }
}

async function shutHook(webhook) {
  try {
    let result = await axios.delete(webhook);
    return result.status;
  } catch (error) {
    return error;
  }
}

if (token) {
  startUpDiscordBot(token);
}

start(10);
