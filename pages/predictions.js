// pages/predictions.js
import { useState } from 'react';

export default function Predictions() {
    const [predictions, setPredictions] = useState([]);

    const handlePredict = async () => {
        const response = await fetch('/api/predict', {
            method: 'POST',
        });
        const data = await response.json();
        setPredictions(data.predictions);
    };

    return (
        <div>
            <h1>Résultats des prédictions</h1>
            <button onClick={handlePredict}>Lancer les prédictions</button>
            <ul>
                {predictions.map((prediction, index) => (
                    <li key={index}>Prédiction {index + 1}: {prediction}</li>
                ))}
            </ul>
        </div>
    );
}