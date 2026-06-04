import requests

BASE_URL = "http://127.0.0.1:8000"


def _handle_response(response):

    try:
        data = response.json()
    except Exception:
        raise Exception(
            f"""
API returned non-JSON response

Status Code: {response.status_code}

Response:
{response.text}
"""
        )

    if response.status_code != 200:
        raise Exception(
            f"""
API Error

Status Code: {response.status_code}

Response:
{data}
"""
        )

    return data


def predict(model, features):

    payload = {
        "model": model,
        "features": features
    }

    response = requests.post(
        f"{BASE_URL}/predict",
        json=payload,
        timeout=30
    )

    return _handle_response(response)


def predict_all(features):

    payload = {
        "model": "random_forest",
        "features": features
    }

    response = requests.post(
        f"{BASE_URL}/predict/all",
        json=payload,
        timeout=30
    )

    return _handle_response(response)


def explain(model, features):

    payload = {
        "model": model,
        "features": features
    }

    response = requests.post(
        f"{BASE_URL}/explain",
        json=payload,
        timeout=30
    )

    return _handle_response(response)