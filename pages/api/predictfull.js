// pages/api/predict.js
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { PythonShell } from 'python-shell';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Méthode non autorisée' });
    }

    const filePath = path.join(process.cwd(), 'public', 'dataset.csv');
    const results = [];

    try {
        const stream = fs.createReadStream(filePath).pipe(csv());

        for await (const data of stream) {
            results.push(data);
        }

        // Appeler le script Python pour faire les prédictions
        const options = {
            mode: 'text',
            pythonPath: 'python3', // ou 'python' selon votre environnement
            scriptPath: path.join(process.cwd(), 'scripts'),
            args: [JSON.stringify(results)]
        };

        PythonShell.run('predict.py', options, (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erreur lors de la prédiction' });
            }
            res.status(200).json({ predictions: results });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
}