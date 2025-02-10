# scripts/predict.py
import sys
import json
import pandas as pd
from sklearn.externals import joblib  # ou import joblib directement si vous utilisez joblib

# Charger le modèle
model = joblib.load('model.pkl')

# Lire les données passées en argument
data = json.loads(sys.argv[1])
df = pd.DataFrame(data)

# Faire les prédictions
predictions = model.predict(df)

# Retourner les prédictions
print(json.dumps(predictions.tolist()))