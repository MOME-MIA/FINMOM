const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

try {
    require.resolve('sharp');
} catch (e) {
    console.log('Installing sharp...');
    execSync('npm install --no-save sharp', { stdio: 'inherit' });
}

const sharp = require('sharp');

const cwd = process.cwd();
const publicDir = path.join(cwd, 'public');
const sourceIcon = path.join(publicDir, 'icon-512x512.png');

const sizes = [72, 96, 128, 144, 256, 384];

async function generateIcons() {
    console.log('Generating PWA icons...');
    for (const size of sizes) {
        const dest = path.join(publicDir, `icon-${size}x${size}.png`);
        await sharp(sourceIcon)
            .resize(size, size)
            .toFile(dest);
        console.log(`Generated ${dest}`);
    }

    // Generate an 'any' purpose icon if we only have maskable. Just copy the 512 one.
    // We already have icon-512x512.png which we can use for 'any'.

    // Generate a temporary 32x32 png for favicon
    console.log('Generating 32x32 favicon png...');
    await sharp(sourceIcon)
        .resize(32, 32)
        .toFile(path.join(publicDir, 'favicon-32x32.png'));

    // Note: creating a true .ico requires a specific format which sharp doesn't fully support 
    // natively for multi-res without extra plugins, but modern browsers accept PNG favicons,
    // or we can just keep the ico simple. Since Next.js supports `favicon.ico` natively,
    // but also supports App Router `icon.png` or `icon.svg`, we could also just delete favicon.ico 
    // and let Next.js use a new `icon.png` placed in the `app/` directory!
}

generateIcons().catch(console.error);
