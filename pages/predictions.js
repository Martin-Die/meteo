// pages/predictions.js
import { useState } from 'react';

export default function Predictions() {
    const [predictions, setPredictions] = useState([]);

    const handlePredict = async () => {
        try {
            const response = await fetch('/api/predict', {
                method: 'POST',
            });
            if (!response.ok) {
                throw new Error('Erreur lors de la requête');
            }
            const data = await response.json();
            setPredictions(data.predictions);
        } catch (error) {
            console.error(error);
            alert('Erreur lors de la récupération des prédictions');
        }
    };

    return (
        <div>
            <h1>Visualiser nos prédictions</h1>
            <button onClick={handlePredict}>Lancer les prédictions</button>
            <ul>
                {predictions.map((prediction, index) => (
                    <li key={index}>Prédiction {index + 1}: {prediction}</li>
                ))}
            </ul>
        </div>
    );
}