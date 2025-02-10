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
    const chunkSize = 100; // Nombre de lignes à lire à la fois
    let results = [];
    let processedRows = 0;

    try {
        const stream = fs.createReadStream(filePath).pipe(csv());

        stream
            .on('data', (data) => {
                results.push(data);
                processedRows++;

                // Si on a atteint la taille du morceau, on traite les données
                if (processedRows >= chunkSize) {
                    stream.pause(); // On met en pause le stream pour traiter les données

                    // Appeler le script Python pour faire les prédictions sur ce morceau
                    const options = {
                        mode: 'text',
                        pythonPath: 'python', // ou 'python' selon votre environnement
                        scriptPath: path.join(process.cwd(), 'scripts'),
                        args: [JSON.stringify(results)]
                    };

                    PythonShell.run('predict.py', options, (err, predictions) => {
                        if (err) {
                            console.error(err);
                            return res.status(500).json({ error: 'Erreur lors de la prédiction' });
                        }

                        // Envoyer les prédictions pour ce morceau
                        res.write(JSON.stringify({ predictions }));

                        // Réinitialiser les résultats et reprendre le stream
                        results = [];
                        processedRows = 0;
                        stream.resume();
                    });
                }
            })
            .on('end', () => {
                // Traiter les dernières lignes du fichier (s'il reste des données)
                if (results.length > 0) {
                    const options = {
                        mode: 'text',
                        pythonPath: 'python',
                        scriptPath: path.join(process.cwd(), 'scripts'),
                        args: [JSON.stringify(results)]
                    };

                    PythonShell.run('predict.py', options, (err, predictions) => {
                        if (err) {
                            console.error(err);
                            return res.status(500).json({ error: 'Erreur lors de la prédiction' });
                        }

                        // Envoyer les dernières prédictions
                        res.write(JSON.stringify({ predictions }));
                        res.end(); // Terminer la réponse
                    });
                } else {
                    res.end(); // Terminer la réponse si aucune donnée restante
                }
            })
            .on('error', (error) => {
                console.error(error);
                res.status(500).json({ error: 'Erreur lors de la lecture du fichier CSV' });
            });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
}