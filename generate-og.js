const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const cwd = process.cwd();
const publicDir = path.join(cwd, 'public');
const logoPath = path.join(publicDir, 'icon-512x512.png'); // Using this as the base logo
const ogImagePath = path.join(publicDir, 'opengraph-image.png');
const twitterImagePath = path.join(publicDir, 'twitter-image.png');

async function createOGImage() {
    console.log('Generating OG Image...');

    // Create a 1200x630 black canvas
    const ogBackground = sharp({
        create: {
            width: 1200,
            height: 630,
            channels: 4,
            background: { r: 0, g: 0, b: 0, alpha: 1 }
        }
    });

    // We will composite the logo in the center and add some simple text or just keep the logo
    // Let's just resize the logo to be nicely centered
    const resizedLogo = await sharp(logoPath)
        .resize(300, 300, { fit: 'inside' })
        .toBuffer();

    await ogBackground.composite([
        { input: resizedLogo, gravity: 'center' }
    ]).toFile(ogImagePath);
    console.log(`Generated ${ogImagePath}`);

    // For Twitter, the standard size is the same modern standard: 1200x630
    fs.copyFileSync(ogImagePath, twitterImagePath);
    console.log(`Generated ${twitterImagePath}`);
}

createOGImage().catch(console.error);
