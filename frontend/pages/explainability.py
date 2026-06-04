import streamlit as st
import pandas as pd

from services.api import explain
from components.feature_form import render_feature_form

st.title("Model Explainability")

st.write(
    "View the most important features influencing the prediction."
)

model = st.selectbox(
    "Select Model",
    [
        "random_forest",
        "xgboost"
    ]
)

features = render_feature_form()

if st.button("Explain Prediction"):

    with st.spinner("Generating explanation..."):

        result = explain(
            model,
            features
        )

    st.subheader(
        f"Top Factors ({model})"
    )

    df = pd.DataFrame(
        result["top_features"],
        columns=[
            "Feature",
            "Impact"
        ]
    )

    st.dataframe(
        df,
        use_container_width=True
    )

    st.subheader("Feature Impact Chart")

    chart_df = df.set_index(
        "Feature"
    )

    chart_df = df.sort_values(
        by="Impact",
        ascending=False
    )

    st.bar_chart(
        chart_df.set_index(
            "Feature"
        )
    )

    st.subheader(
        "Most Influential Features"
    )

    for idx, row in df.iterrows():

        impact = row["Impact"]

        if impact > 0:
            direction = "increased risk"
        else:
            direction = "decreased risk"

        st.write(
            f"**{row['Feature']}** ({impact:.4f}) → {direction}"
        )