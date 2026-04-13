// Učitavanje potrebnih modula
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Postavljanje EJS kao template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Posluživanje statičkih datoteka iz mape public/
app.use(express.static(path.join(__dirname, 'public')));

// ─── RUTE ───────────────────────────────────────────────────────────────────

// Početna stranica – tablica filmova
app.get('/', (req, res) => {
    res.render('index');
});

// Stranica grafikona
app.get('/grafikon', (req, res) => {
    res.render('grafikon');
});

// Galerija – slike se generiraju dinamički iz mape public/images/
// ili iz images.json ako nema lokalnih slika
app.get('/slike', (req, res) => {
    const folderPath = path.join(__dirname, 'public', 'images');
    const files = fs.readdirSync(folderPath);
    const extensions = ['.jpg', '.jpeg', '.png', '.svg', '.webp'];

    // Filtriramo samo slike prema ekstenziji
    const localImages = files.filter(function(file) {
        const lower = file.toLowerCase();
        return extensions.some(function(ext) { return lower.endsWith(ext); });
    });

    let images;

    if (localImages.length > 0) {
        // Koristimo lokalne slike iz public/images/ mape
        images = localImages.map(function(file, index) {
            return {
                url: '/images/' + file,
                id: 'slika' + (index + 1),
                title: 'Slika ' + (index + 1)
            };
        });
    } else {
        // Fallback: čitamo slike iz images.json datoteke
        const dataPath = path.join(__dirname, 'images.json');
        images = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    }

    // Renderiramo EJS predložak i prosljeđujemo podatke o slikama
    res.render('slike', { images: images });
});

// Pokretanje servera
app.listen(PORT, function() {
    console.log('Server pokrenut na http://localhost:' + PORT);
});
