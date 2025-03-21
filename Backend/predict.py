import joblib
import sys
import json
import pandas as pd

try:
    # Load model
    model = joblib.load('svm_fraud_model.pkl')

    # Load expected feature order
    feature_names = joblib.load('model_feature_names.pkl')

    # Read input JSON from command-line argument
    input_data = json.loads(sys.argv[1])

    # Convert input to DataFrame
    df = pd.DataFrame([input_data])

    # Ensure the feature order matches training
    df = df[feature_names]

    # Predict fraud
    prediction = model.predict(df)[0]

    # **Force UTF-8 encoding**
    print(json.dumps({'is_fraud': int(prediction)}, ensure_ascii=False).encode('utf-8').decode())

except Exception as e:
    print(json.dumps({'error': str(e)}, ensure_ascii=False).encode('utf-8').decode())
    sys.exit(1)
