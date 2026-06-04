import streamlit as st


def render_feature_form():

    st.subheader("Patient Information")

    col1, col2 = st.columns(2)

    with col1:

        Age = st.number_input("Age", 0, 120, 65)

        Gender = st.selectbox(
            "Gender",
            [0, 1]
        )

        Ethnicity = st.selectbox(
            "Ethnicity",
            [0, 1, 2, 3]
        )

        EducationLevel = st.selectbox(
            "Education Level",
            [0, 1, 2, 3]
        )

        BMI = st.number_input(
            "BMI",
            value=25.0
        )

        Smoking = st.selectbox(
            "Smoking",
            [0, 1]
        )

        AlcoholConsumption = st.number_input(
            "Alcohol Consumption",
            value=1.0
        )

        PhysicalActivity = st.number_input(
            "Physical Activity",
            value=5.0
        )

        DietQuality = st.number_input(
            "Diet Quality",
            value=5.0
        )

        SleepQuality = st.number_input(
            "Sleep Quality",
            value=5.0
        )

        FamilyHistoryAlzheimers = st.selectbox(
            "Family History Alzheimer's",
            [0, 1]
        )

        CardiovascularDisease = st.selectbox(
            "Cardiovascular Disease",
            [0, 1]
        )

        Diabetes = st.selectbox(
            "Diabetes",
            [0, 1]
        )

        Depression = st.selectbox(
            "Depression",
            [0, 1]
        )

        HeadInjury = st.selectbox(
            "Head Injury",
            [0, 1]
        )

        Hypertension = st.selectbox(
            "Hypertension",
            [0, 1]
        )

    with col2:

        SystolicBP = st.number_input(
            "Systolic BP",
            value=120.0
        )

        DiastolicBP = st.number_input(
            "Diastolic BP",
            value=80.0
        )

        CholesterolTotal = st.number_input(
            "Cholesterol Total",
            value=180.0
        )

        CholesterolLDL = st.number_input(
            "Cholesterol LDL",
            value=90.0
        )

        CholesterolHDL = st.number_input(
            "Cholesterol HDL",
            value=50.0
        )

        CholesterolTriglycerides = st.number_input(
            "Triglycerides",
            value=150.0
        )

        MMSE = st.number_input(
            "MMSE",
            value=25.0
        )

        FunctionalAssessment = st.number_input(
            "Functional Assessment",
            value=5.0
        )

        MemoryComplaints = st.selectbox(
            "Memory Complaints",
            [0, 1]
        )

        BehavioralProblems = st.selectbox(
            "Behavioral Problems",
            [0, 1]
        )

        ADL = st.number_input(
            "ADL",
            value=5.0
        )

        Confusion = st.selectbox(
            "Confusion",
            [0, 1]
        )

        Disorientation = st.selectbox(
            "Disorientation",
            [0, 1]
        )

        PersonalityChanges = st.selectbox(
            "Personality Changes",
            [0, 1]
        )

        DifficultyCompletingTasks = st.selectbox(
            "Difficulty Completing Tasks",
            [0, 1]
        )

        Forgetfulness = st.selectbox(
            "Forgetfulness",
            [0, 1]
        )

    return {
        "Age": Age,
        "Gender": Gender,
        "Ethnicity": Ethnicity,
        "EducationLevel": EducationLevel,
        "BMI": BMI,
        "Smoking": Smoking,
        "AlcoholConsumption": AlcoholConsumption,
        "PhysicalActivity": PhysicalActivity,
        "DietQuality": DietQuality,
        "SleepQuality": SleepQuality,
        "FamilyHistoryAlzheimers": FamilyHistoryAlzheimers,
        "CardiovascularDisease": CardiovascularDisease,
        "Diabetes": Diabetes,
        "Depression": Depression,
        "HeadInjury": HeadInjury,
        "Hypertension": Hypertension,
        "SystolicBP": SystolicBP,
        "DiastolicBP": DiastolicBP,
        "CholesterolTotal": CholesterolTotal,
        "CholesterolLDL": CholesterolLDL,
        "CholesterolHDL": CholesterolHDL,
        "CholesterolTriglycerides": CholesterolTriglycerides,
        "MMSE": MMSE,
        "FunctionalAssessment": FunctionalAssessment,
        "MemoryComplaints": MemoryComplaints,
        "BehavioralProblems": BehavioralProblems,
        "ADL": ADL,
        "Confusion": Confusion,
        "Disorientation": Disorientation,
        "PersonalityChanges": PersonalityChanges,
        "DifficultyCompletingTasks": DifficultyCompletingTasks,
        "Forgetfulness": Forgetfulness
    }