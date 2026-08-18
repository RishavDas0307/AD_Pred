from app.services.explanation_service import (
    calculate_feature_contributions,
    generate_explanations
)


def explain_prediction(model_name: str, features: dict):
    contributions = calculate_feature_contributions(model_name, features)

    sorted_features = sorted(
        contributions.items(),
        key=lambda x: abs(x[1]),
        reverse=True
    )

    explanations = generate_explanations(
        model_name,
        features,
        top_k=5
    )

    return {
        "model": model_name,
        "top_features": sorted_features[:10],
        "explanations": explanations
    }