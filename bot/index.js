require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const { ethers } = require('ethers');
const { Connection, PublicKey, clusterApiUrl } = require('@solana/web3.js');
const axios = require('axios');

// Load environment variables (User needs to create .env in bot/ directory or pass them)
const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const WEB_APP_URL = process.env.WEB_APP_URL || 'https://malinwallet.app'; // Placeholder
const INFURA_KEY = process.env.INFURA_API_KEY || '97ecdb3bd46649e5b03d041dafad5661'; // From user previous input
const ZEROX_KEY = process.env.ZEROX_API_KEY || '50d0ce66-7c28-4c4e-ba23-2f41e1561ef4';
const FEE_RECIPIENT = '0xeeafb3f49fe1a7156a580877346b347c4709e8e6';
const AFFILIATE_ID = '9817a72d5f2caf';

if (!TOKEN) {
    console.error('Error: TELEGRAM_BOT_TOKEN is missing in .env');
    // We don't exit here to allow testing structure, but in prod it should exit.
}

const bot = new Telegraf(TOKEN);

// --- HELPERS ---

async function getEthBalance(address) {
    try {
        const provider = new ethers.JsonRpcProvider(`https://mainnet.infura.io/v3/${INFURA_KEY}`);
        const balance = await provider.getBalance(address);
        return ethers.formatEther(balance);
    } catch (e) {
        console.error('ETH Balance Error:', e.message);
        return 'Error';
    }
}

async function getSolBalance(address) {
    try {
        const connection = new Connection(clusterApiUrl('mainnet-beta'));
        const publicKey = new PublicKey(address);
        const balance = await connection.getBalance(publicKey);
        return balance / 1e9;
    } catch (e) {
        console.error('SOL Balance Error:', e.message);
        return 'Error';
    }
}

// --- COMMANDS ---

bot.start((ctx) => {
    ctx.reply(
        "Bienvenue sur MalinWallet Bot ! 🟡\n\nJe suis votre assistant crypto personnel. Je peux gérer vos transactions, swap, et achats directement ici.\n\nLancez la Mini App pour une expérience visuelle complète ou utilisez les commandes ci-dessous.",
        Markup.keyboard([
            [Markup.button.webApp("📱 Ouvrir MalinWallet Mini App", WEB_APP_URL)],
            ["💰 Solde", "📤 Envoyer", "📥 Recevoir"],
            ["🔄 Swap", "🛒 Acheter Crypto", "💸 Vendre"]
        ]).resize()
    );
});

bot.hears('💰 Solde', async (ctx) => {
    // In a real bot, we would map the Telegram User ID to a stored wallet address in a database.
    // For this demo, we'll ask the user or simulate.
    ctx.reply("Pour quel wallet voulez-vous voir le solde ? Envoyez votre adresse ETH ou SOL.", Markup.forceReply());
});

bot.hears('📥 Recevoir', (ctx) => {
    ctx.reply(
        "Pour recevoir des cryptos, ouvrez la Mini App pour afficher votre QR Code et votre adresse en toute sécurité.",
        Markup.inlineKeyboard([
            [Markup.button.webApp("📱 Ouvrir QR Code", WEB_APP_URL)]
        ])
    );
});

bot.hears('📤 Envoyer', (ctx) => {
    ctx.reply(
        "Pour envoyer des cryptos, veuillez utiliser la Mini App pour signer la transaction de manière sécurisée.",
        Markup.inlineKeyboard([
            [Markup.button.webApp("🚀 Envoyer via Mini App", WEB_APP_URL)]
        ])
    );
});

bot.on('text', async (ctx) => {
    const text = ctx.message.text.trim();

    // Simple address detection
    if (ethers.isAddress(text)) {
        const loading = await ctx.reply("🔍 Vérification du solde ETH...");
        const bal = await getEthBalance(text);
        ctx.telegram.editMessageText(ctx.chat.id, loading.message_id, null, `💰 Solde ETH: ${bal} ETH`);
    } else if (text.length > 30 && !text.includes(' ')) {
        // Assume SOL address length check roughly
        try {
            new PublicKey(text); // Check validity
            const loading = await ctx.reply("🔍 Vérification du solde SOL...");
            const bal = await getSolBalance(text);
            ctx.telegram.editMessageText(ctx.chat.id, loading.message_id, null, `☀️ Solde SOL: ${bal} SOL`);
        } catch {
            // Not an address, maybe chat
            // ctx.reply("Je n'ai pas reconnu cette adresse.");
        }
    }
});

bot.hears('🔄 Swap', (ctx) => {
    ctx.reply("Quel swap voulez-vous effectuer ? (Ex: ETH -> USDC)", Markup.inlineKeyboard([
        [Markup.button.callback("ETH -> USDC", "swap_eth_usdc")],
        [Markup.button.callback("SOL -> USDC", "swap_sol_usdc")]
    ]));
});

bot.action('swap_eth_usdc', (ctx) => {
    // Here we would ideally ask for amount, then fetch 0x quote
    ctx.reply("Combien d'ETH voulez-vous échanger ?");
    // State management would be needed here (e.g., telegraf-session) to capture the next message as amount.
});

bot.hears('🛒 Acheter Crypto', (ctx) => {
    // ChangeNOW Logic
    // We need an address. If stored, use it. Else ask.
    const url = `https://changenow.io/exchange?from=eur&to=eth&amount=50&link_id=${AFFILIATE_ID}`;
    ctx.reply(`Achetez vos cryptos facilement et en toute sécurité ici : ${url}`,
        Markup.inlineKeyboard([
            Markup.button.url("Acheter maintenant", url)
        ])
    );
});

// --- LAUNCH ---

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

if (TOKEN) {
    bot.launch().then(() => console.log('MalinWallet Bot started'));
} else {
    console.log('Bot not started: No Token provided in .env');
}
