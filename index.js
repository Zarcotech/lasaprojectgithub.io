import express from 'express';
import { join, dirname, resolve } from 'path'; 
import { fileURLToPath } from 'url';

const app = express();
const port = 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(resolve(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'public', 'templates', 'index.html'));
});

app.use((req, res) => {
    res.status(404).sendFile(join(__dirname, 'public', 'templates', '404.html'));
})

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
});