# Disboard Bump Reminder

Remind your server members to bump using this simple discord.js based bot.

Features:

- Custom Channel
- Custom Role
- Custom Reminder Message

## How to deploy:

Requirements:

- Node.js version 20

### First time:

Update the `.env` file using your own Discord Bot Client ID and Token.

Deploying this bot for the first time requires you to update Discord's Slash Command Interface using the API. Note that you will need to do this again for every bot with a different client ID.

```sh
npm install
npm run deploy
npm run start
```

### Every other time:

```sh
npm run start
```

I recommend using something like [PM2](https://github.com/Unitech/pm2) to run the bot in production.

## License

Disboard Bump Reminder is made available under the terms of the [MIT License](./LICENSE).