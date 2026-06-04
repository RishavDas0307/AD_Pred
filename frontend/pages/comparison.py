import streamlit as st
import pandas as pd

from services.api import predict_all
from components.feature_form import render_feature_form

st.set_page_config(
    page_title="Model Comparison",
    layout="wide"
)

st.title("📊 Model Comparison")

st.markdown(
    "Compare predictions from all trained machine learning models."
)

features = render_feature_form()

if st.button(
    "Compare Models",
    use_container_width=True
):

    try:

        with st.spinner("Running all models..."):

            result = predict_all(
                features
            )

        rows = []

        for model_name, values in result.items():

            prediction = values["prediction"]

            prediction_label = (
                "Alzheimer's Detected"
                if prediction == 1
                else "No Alzheimer's"
            )

            rows.append(
                {
                    "Model": model_name,
                    "Prediction": prediction_label,
                    "Probability (%)":
                        round(
                            values["probability"] * 100,
                            2
                        )
                        if values["probability"] is not None
                        else None
                }
            )

        df = pd.DataFrame(rows)

        st.divider()

        st.subheader("Results")

        st.dataframe(
            df,
            use_container_width=True
        )

        valid_df = df.dropna()

        if not valid_df.empty:

            highest_risk = valid_df.loc[
                valid_df["Probability (%)"].idxmax()
            ]

            st.info(
                f"Highest Risk Prediction: "
                f"{highest_risk['Model']} "
                f"({highest_risk['Probability (%)']}%)"
            )

            st.subheader(
                "Probability Comparison"
            )

            chart_df = valid_df.set_index(
                "Model"
            )

            st.bar_chart(
                chart_df["Probability (%)"]
            )

    except Exception as e:

        st.error(
            f"Comparison failed:\n\n{str(e)}"
        )