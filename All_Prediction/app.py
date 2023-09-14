import json
import pickle

import numpy as np
import openai
import pandas as pd
import requests
from flask import Flask, jsonify, render_template, request
from sklearn.linear_model import LogisticRegression

app = Flask(__name__)

openai.api_key = "sk-"  # add api key here

# Load the trained model
with open("model.pkl", "rb") as file:
    heart_diseases_model = pickle.load(file)

with open("diabetes_model.pkl", "rb") as f:
    diabetes_model = pickle.load(f)

with open("lung_cancer_predictor_model.pkl", "rb") as f:
    cancer_model = pickle.load(f)


@app.route("/")
def home():
    return render_template("index.html")


# Route for Heart Disease Prediction page
@app.route("/heart_disease")
def heart_disease():
    return render_template("heart_disease.html")


@app.route("/lungs")
def lungs():
    return render_template("lungs.html")


@app.route("/diabetes")
def diabetes():
    return render_template("diabetes.html")


@app.route("/about")
def about():
    return render_template("about.html")


@app.route("/blog")
def blog():
    return render_template("blog.html")


@app.route("/create")
def create():
    return render_template("create_blogpost.html")


@app.route("/list")
def list():
    return render_template("list.html")


@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_japp

    input_data = np.array(data["input_data"])

    # Reshape the input data
    input_data_reshaped = input_data.reshape(1, -1)

    # Make prediction using the loaded model
    prediction1 = diabetes_model.predict(input_data_reshaped)

    # Prepare the response
    if prediction1[0] == 0:
        return jsonify(
            {"result": "Based on the information provided, you are not diabetic."}
        )
    else:
        return jsonify(
            {
                "result": "Based on the information provided, the result showed that you are diabetic. Kindly visit a doctor"
            }
        )

    # Diabetes Prediction


app.route("/heart_disease_predict", methods=["POST"])


def predict2():
    # Get the input values from the form
    age = int(request.form["age"])
    sex = int(request.form["sex"])
    cp = int(request.form["cp"])
    trestbps = float(request.form["trestbps"])
    chol = float(request.form["chol"])
    fbs = int(request.form["fbs"])
    restecg = int(request.form["restecg"])
    thalach = float(request.form["thalach"])
    exang = int(request.form["exang"])
    oldpeak = float(request.form["oldpeak"])
    slope = int(request.form["slope"])
    ca = int(request.form["ca"])
    thal = int(request.form["thal"])

    # Create a DataFrame with the input values
    input_data = pd.DataFrame(
        [
            [
                age,
                sex,
                cp,
                trestbps,
                chol,
                fbs,
                restecg,
                thalach,
                exang,
                oldpeak,
                slope,
                ca,
                thal,
            ]
        ],
        columns=[
            "age",
            "sex",
            "cp",
            "trestbps",
            "chol",
            "fbs",
            "restecg",
            "thalach",
            "exang",
            "oldpeak",
            "slope",
            "ca",
            "thal",
        ],
    )

    # Make the prediction
    prediction = heart_diseases_model.predict(input_data)

    # Convert the prediction to a meaningful result
    if prediction[0] == 0:
        result = "Based on the information provided, you do not have heart disease"
    else:
        result = "Based on the information provided, the result showed that you have heart disease. Kindly visit a doctor"

    # Return the result to the frontend
    return jsonify({"result": result})


@app.route("/lungs_predict", methods=["POST"])
def lungs_predict():
    data = request.get_json()

    gender = int(data["GENDER"])
    age = int(data["AGE"])
    smoking = int(data["SMOKING"])
    yellow_fingers = int(data["YELLOW_FINGERS"])
    anxiety = int(data["ANXIETY"])
    peer_pressure = int(data["PEER_PRESSURE"])
    chronic_disease = int(data["CHRONIC_DISEASE"])
    fatigue = int(data["FATIGUE"])
    allergy = int(data["ALLERGY"])
    wheezing = int(data["WHEEZING"])
    alcohol_consuming = int(data["ALCOHOL_CONSUMPTION"])
    coughing = int(data["COUGHING"])
    shortness_of_breath = int(data["SHORTNESS_OF_BREATH"])
    swallowing_difficulty = int(data["SWALLOWING_DIFFICULTY"])
    chest_pain = int(data["CHEST_PAIN"])

    features = np.array(
        [
            [
                gender,
                age,
                smoking,
                yellow_fingers,
                anxiety,
                peer_pressure,
                chronic_disease,
                fatigue,
                allergy,
                wheezing,
                alcohol_consuming,
                coughing,
                shortness_of_breath,
                swallowing_difficulty,
                chest_pain,
            ]
        ]
    )

    predictions = cancer_model.predict(features)
    if predictions == 1:
        return jsonify(
            {
                "message": "This person has a very high chance of having lung cancer. Please see a doctor!"
            }
        )
    elif predictions == 0:
        return jsonify(
            {
                "message": "The probability of this person having lung cancer is very low."
            }
        )


@app.route("/get_ai_response", methods=["POST"])
def get_ai_response():
    user_message = request.json["user_message"]
    URL = "https://api.openai.com/v1/chat/completions"

    payload = {
        "model": "gpt-3.5-turbo",
        "messages": [
            {"role": "assistant", "content": f"Subject: {user_message}\n\nBody:"}
        ],
        "temperature": 1.0,
        "top_p": 1.0,
        "n": 1,
        "stream": False,
        "presence_penalty": 0,
        "frequency_penalty": 0,
    }

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {openai.api_key}",
    }

    response = requests.post(URL, headers=headers, json=payload, stream=False)

    # Check if the response status code is 200 (OK)
    if response.status_code == 200:
        # Parse the response JSON
        parsed_response = json.loads(response.text)

        # Extract and beautify the content
        content = parsed_response["choices"][0]["message"]["content"]
        beautified_response = content.replace("\n\n", "\n")
        return beautified_response
    else:
        return "An error occurred"


if __name__ == "__main__":
    app.run(debug=True)
