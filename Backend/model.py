import pandas as pd
import joblib
from sklearn.svm import SVC
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline

# Load dataset
df = pd.read_csv('transactions_train.csv')

# Encode transaction_channel
df['transaction_channel'] = df['transaction_channel'].map({'w':1, 'mobile':2, 'W':3, 'M':4, '#':5, 'npm':6, '1':7, 'WEB':8, '5666':9})

# Process time
df['transaction_date'] = pd.to_datetime(df['transaction_date'])
df['time'] = df['transaction_date'].dt.time
df['time'] = df['time'].apply(lambda t: 1 if t >= pd.Timestamp('12:00:00').time() else -1)
df['transaction_amount'] = df['transaction_amount'].fillna(0)

# Drop complex columns
df = df.drop(['transaction_payment_mode_anonymous','payer_browser_anonymous','payment_gateway_bank_anonymous','payer_email_anonymous', 'payee_ip_anonymous', 'payer_mobile_anonymous', 'transaction_id_anonymous', 'payee_id_anonymous','transaction_date'], axis=1, errors='ignore')

# Print the column names to ensure we know what features we're using
print("Feature columns used for training:", list(df.columns.drop('is_fraud')))

y_train = df['is_fraud']
X_train = df.drop('is_fraud', axis=1)

# Train SVM model
svm_rbf = make_pipeline(StandardScaler(), SVC(kernel='rbf', C=1.0, gamma='scale'))
svm_rbf.fit(X_train, y_train)

# Save the trained model
joblib.dump(svm_rbf, 'svm_fraud_model.pkl')

# Also save the feature names to ensure consistency during prediction
feature_names = list(X_train.columns)
joblib.dump(feature_names, 'model_feature_names.pkl')

print("✅ Model trained and saved as 'svm_fraud_model.pkl'")
print("✅ Feature names saved as 'model_feature_names.pkl'")
print("✅ Make sure to use these exact feature names in the same order during prediction")
print("✅ For prediction, input data must have these columns in this exact order:", feature_names)
print("✅ Example: If your input is {'transaction_amount': 100.5, 'transaction_channel': 2, 'time': 1}, ")
print("   ensure the columns are ordered exactly as in feature_names to avoid the error:")
print("   'The feature names should match those that were passed during fit.'")
