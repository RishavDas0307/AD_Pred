import streamlit as st

from services.api import predict
from components.feature_form import render_feature_form

st.set_page_config(
    page_title="Prediction",
    layout="wide"
)

st.title("🧠 Alzheimer's Disease Prediction")

st.markdown(
    "Enter patient details and select a model to generate a prediction."
)

model = st.selectbox(
    "Select Model",
    [
        "logistic_regression",
        "random_forest",
        "xgboost",
        "svm"
    ]
)

features = render_feature_form()

if st.button(
    "Predict",
    use_container_width=True
):

    try:

        with st.spinner("Generating prediction..."):

            result = predict(
                model,
                features
            )

        prediction = result["prediction"]
        probability = result["probability"]

        st.divider()

        col1, col2 = st.columns(2)

        with col1:

            if prediction == 1:

                st.error(
                    "⚠️ Alzheimer's Risk Detected"
                )

            else:

                st.success(
                    "✅ No Alzheimer's Risk Detected"
                )

        with col2:

            if probability is not None:

                st.metric(
                    "Confidence",
                    f"{probability * 100:.2f}%"
                )

        st.subheader("Prediction Details")

        st.json(result)

    except Exception as e:

        st.error(
            f"Prediction failed:\n\n{str(e)}"
        )