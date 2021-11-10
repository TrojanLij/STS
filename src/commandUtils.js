const { getCommandArgs, warpTripleQuote } = require("./utils");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { REST } = require("@discordjs/rest");
const { writeError } = require("./log");
const apiVersion = 9;
const { Routes } = require(`discord-api-types/v${apiVersion}`);

function createCommandHandler(client, prefix) {
  prefix = prefix.toLowerCase();
  const map = new Map();
  const commands = [];
  const slashCommands = [];
  const rest = new REST({ version: apiVersion.toString() }).setToken(
    client.token
  );

  function createCommand(alias, help, handler, args) {
    const ref = {
      help,
      handler,
      alias,
      args: args ? args.map((a) => a.name) : [],
    };

    commands.push(`${alias[0]} - ${help}`);
    const slashCommand = new SlashCommandBuilder();
    slashCommand.setName(alias[0]);
    slashCommand.setDescription(help);
    if (args) {
      for (const arg of args) {
        slashCommand.addStringOption((option) => {
          const opt = option
            .setName(arg.name)
            .setDescription(arg.description)
            .setRequired(!!arg.required);

          if (arg.choices) {
            for (let i = 0; i < arg.choices.length; i++) {
              opt.addChoice(arg.choices[i], arg.choices[i]);
            }
          }
          return opt;
        });
      }
    }

    slashCommands.push(slashCommand);
    for (let i = 0; i < alias.length; i++) {
      map.set(alias[i].toLowerCase(), ref);
    }
  }

  let addedEventListener = false;
  async function initSlashCommands() {
    const body = slashCommands.map((c) => c.toJSON());

    const guilds = client.guilds.cache.map((g) => g);
    for (const guild of guilds) {
      try {
        await rest.put(
          Routes.applicationGuildCommands(client.application.id, guild.id),
          { body }
        );
      } catch (error) {
        const msg = `failed initialized commands on guild ${guild.name}(${guild.id})`;
        console.error(msg);
        writeError(error, msg);
      }
    }
    if (!addedEventListener) {
      addedEventListener = true;
      client.on("interactionCreate", onInteraction);
    }
  }

  function onInteraction(interaction) {
    if (!interaction.isCommand()) return;
    const cmd = interaction.commandName.toLowerCase();
    const ref = map.get(cmd);
    if (ref) {
      ref.handler(
        ref.args ? ref.args.map((a) => interaction.options.getString(a)) : [],
        (payload) => {
          interaction.reply(payload);
        },
        cmd,
        interaction,
        ref
      );
    } else {
      interaction.reply(`${cmd}: command not found`);
    }
  }

  function onMessage(msg) {
    if (msg.author.bot) return;
    const content = msg.content;
    if (content.toLowerCase().startsWith(prefix)) {
      const noPrefix = content.slice(prefix.length);
      const split = noPrefix.split(" ")[0];
      const ref = map.get(split.toLowerCase());
      if (ref) {
        ref.handler(
          getCommandArgs(msg),
          (payload) => msg.channel.send(payload, { split: true }),
          split,
          msg,
          ref
        );
      } else {
        msg.channel.send(`${split}: command not found`);
      }
    }
  }

  createCommand(
    ["help", "?"],
    "Shows help",
    (_args, reply, _originalMessage) => {
      reply(warpTripleQuote(commands.join("\n")));
    }
  );

  client.on("messageCreate", onMessage);

  return {
    createCommand,
    initSlashCommands,
  };
}

module.exports.createCommandHandler = createCommandHandler;
