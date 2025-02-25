import sys
import pickle
import numpy as np
import pandas as pd

# Load trained model
with open("xgboost_model.pkl", "rb") as model_file:
    model = pickle.load(model_file)

# Load encoders
with open("label_encoders.pkl", "rb") as encoder_file:
    label_encoders = pickle.load(encoder_file)

try:
    # Read inputs from Node.js (passed via command-line arguments)
    date = sys.argv[1]  # Format: YYYY-MM-DD
    time = sys.argv[2]  # Format: HH:MM
    distance = float(sys.argv[3])
    # vehicle_type = sys.argv[4]
    base_fare = float(sys.argv[5])
    traffic = sys.argv[6]
    weather = sys.argv[7]

    # Convert date & time
    date_obj = pd.to_datetime(date)
    day_of_week = date_obj.dayofweek  # Convert to (0=Monday, ..., 6=Sunday)
    
    time_obj = pd.to_datetime(time, format='%H:%M')
    hour_of_day = time_obj.hour  # Extract hour (0-23)

    # Encode categorical inputs
    # vehicle_type_encoded = label_encoders["vehicleType"].transform([vehicle_type])[0]
    traffic_encoded = label_encoders["traffic"].transform([traffic])[0]
    weather_encoded = label_encoders["weather"].transform([weather])[0]

    # Prepare input data for prediction
    input_data = np.array([[day_of_week, hour_of_day, distance, traffic_encoded, weather_encoded, base_fare]])

    # Predict fare
    predicted_fare = model.predict(input_data)[0]

    # Print result (so Node.js can read it)
    print(predicted_fare)

except Exception as e:
    print("Error:", e)
