const fs = require("fs");
const { prettifyConsoleOutput } = require("./src/log");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");

prettifyConsoleOutput();

async function init() {
  let check = true;
  // check .env
  fs.access("./.env", fs.F_OK, (err) => {
    if (err) {
      fs.writeFileSync("./.env", 'NODE_ENV="production"', function (err) {
        if (err) throw err;
        console.log("**./.env created");
        check = false;
      });
    } else {
      console.log("-- ./.env existed");
    }
  });

  // check conf.json
  fs.access("./conf.json", fs.F_OK, (err) => {
    if (err) {
      let templateConfig = {
        token: "YOUR_TOKEN_HERE",
        prefix: "!",
        ignoreErrors: false,
      };
      fs.writeFile(
        "./conf.json",
        JSON.stringify(templateConfig, undefined, 2),
        function (err) {
          if (err) throw err;
          console.log("** conf.json created");
          check = false;
        }
      );
    } else {
      console.log("-- conf.json existed");
    }
  });

  // check webhooks.json
  fs.access("./webhooks.json", fs.F_OK, (err) => {
    let webhook_json = {
      scamHookUrl: "scammer_WH_URL",
      reportHookUrl: "report_WH_URL",
    };
    if (err) {
      fs.writeFileSync("webhooks.json", webhook_json, function (err) {
        if (err) throw err;
        console.log("** webhooks.json created");
        check = false;
      });
    } else {
      console.log("-- webhooks.json existed");
    }
  });

  return check;
}

yargs(hideBin(process.argv))
  .command(
    "token <token>",
    "Add or update Discord token",
    (yargs) => {
      yargs.positional("token", {
        description: "Discord token",
        default: "YOUR TOKEN HERE",
      });
    },
    (argv) => {
      fs.access("./conf.json", fs.F_OK, (err) => {
        if (err) {
          let templateConfig = {
            token: argv.token,
            prefix: "!",
            ignoreErrors: false,
          };
          fs.writeFile(
            "./conf.json",
            JSON.stringify(templateConfig, undefined, 2),
            function (err) {
              if (err) throw err;
              console.log("** conf.json created");
              process.exit(0);
            }
          );
        } else {
          const readConf = fs.readFileSync("./conf.json");
          let readData = JSON.parse(readConf);
          readData.token = argv.token;
          try {
            fs.writeFileSync("./conf.json", JSON.stringify(readData, undefined, 2));
            console.log("updated discord token");
            process.exit(0);
          } catch (error) {
            console.log(error);
            process.exit(1);
          }
        }
      });
    }
  )
  .command(
    "add-hook <hook>",
    "Add webhook of discord scammer",
    (yargs) =>{
      yargs.positional("hook",{
        description: "Discord scammer webhook"
      });
    }, (argv) => {
      if (argv.hook != null || argv.hook != '') {
        fs.access("webhooks.json", fs.F_OK, (err) => {
          let webhook_json = {
            scamHookUrls: ["scammer_WH_URL"],
            reportHookUrl: "report_WH_URL",
          };
          if (err) {
            fs.writeFileSync("./webhooks.json", JSON.stringify(webhook_json,undefined,2), function (err) {
              if (err) throw err;
              console.log("** webhooks.json created");
              process.exit(0);
            });
          } else {
            const readWH = fs.readFileSync("./webhooks.json");
            let readData = JSON.parse(readWH);
            readData.scamHookUrls.push(argv.hook);
            try {
              fs.writeFileSync("./webhooks.json", JSON.stringify(readData, undefined, 2));
              console.log("updated scam webhook list");
              process.exit(0);
            } catch (error) {
              console.log(error);
              process.exit(1);
            }
          }
        });
      } else {
        console.log("Empty or issue with token");
        process.exit(1);
      }
    }
  )
  .parse();

(async () => {
  if ((await init()) === true) {
    require("./src/index");
  } else {
    process.exit(0);
  }
})()
