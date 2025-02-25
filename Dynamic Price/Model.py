import pandas as pd
import numpy as np
import xgboost as xgb
import pickle
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder

# Load dataset
df = pd.read_csv("data/rides_data.csv")

# Convert 'date' to day of the week (0=Monday, ..., 6=Sunday)
df['date'] = pd.to_datetime(df['date'])
df['day_of_week'] = df['date'].dt.dayofweek

# Convert 'time' to hour (0-23)
df['hour_of_day'] = pd.to_datetime(df['time'], format='%H:%M').dt.hour

# Encode categorical variables
label_encoders = {}
categorical_cols = ["traffic", "weather"]
for col in categorical_cols:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col])
    label_encoders[col] = le  # Save encoders

# Select features for training
X = df[["day_of_week", "hour_of_day", "distance", "traffic", "weather", "base_fare"]]
y = df["final_fare"]

# Split data into train & test sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=84)

# Train an XGBoost model
model = xgb.XGBRegressor(objective="reg:squarederror", n_estimators=200, learning_rate=0.1)
model.fit(X_train, y_train)

# Save trained model
with open("xgboost_model.pkl", "wb") as model_file:
    pickle.dump(model, model_file)

# Save label encoders
with open("label_encoders.pkl", "wb") as encoder_file:
    pickle.dump(label_encoders, encoder_file)

print("✅ Model training completed & saved!")
