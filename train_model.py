from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix
import joblib


def evaluate_model(name, model, X_train, X_test, y_train, y_test):

    y_pred = model.predict(X_test)

    print(f"\n🔥 {name} Results:")
    print("Accuracy:", accuracy_score(y_test, y_pred))
    print("Precision:", precision_score(y_test, y_pred))
    print("Recall:", recall_score(y_test, y_pred))
    print("F1 Score:", f1_score(y_test, y_pred))

    print("Confusion Matrix:")
    print(confusion_matrix(y_test, y_pred))

    print("Train Accuracy:", model.score(X_train, y_train))
    print("Test Accuracy:", model.score(X_test, y_test))

    return f1_score(y_test, y_pred)


def train_model(X, y):

    # ==============================
    # 1️⃣ Train-Test Split
    # ==============================
    X_train, X_test, y_train, y_test = train_test_split(
        X, y,
        test_size=0.25,
        random_state=42,
        stratify=y
    )

    # ==================================================
    # 🔵 LOGISTIC REGRESSION (With Scaling)
    # ==================================================
    log_pipeline = Pipeline([
        ('scaler', StandardScaler()),
        ('model', LogisticRegression(
            max_iter=2000,
            class_weight='balanced',
            solver='liblinear'
        ))
    ])

    log_param_grid = {
        'model__C': [0.01, 0.1, 0.5, 1, 5, 10]
    }

    log_grid = GridSearchCV(
        log_pipeline,
        log_param_grid,
        cv=5,
        scoring='f1',
        n_jobs=-1
    )

    log_grid.fit(X_train, y_train)
    best_log = log_grid.best_estimator_

    log_f1 = evaluate_model("Logistic Regression", best_log,
                            X_train, X_test, y_train, y_test)


    # ==================================================
    # 🟢 RANDOM FOREST (No Scaling Needed)
    # ==================================================
    rf = RandomForestClassifier(
        class_weight='balanced',
        random_state=42
    )

    rf_param_grid = {
        'n_estimators': [100, 200, 300],
        'max_depth': [3, 4, 5, None]
    }

    rf_grid = GridSearchCV(
        rf,
        rf_param_grid,
        cv=5,
        scoring='f1',
        n_jobs=-1
    )

    rf_grid.fit(X_train, y_train)
    best_rf = rf_grid.best_estimator_

    rf_f1 = evaluate_model("Random Forest", best_rf,
                           X_train, X_test, y_train, y_test)


    # ==================================================
    # 🏆 Select Best Model
    # ==================================================
    if rf_f1 > log_f1:
        final_model = best_rf
        print("\n🏆 Final Selected Model: Random Forest")
    else:
        final_model = best_log
        print("\n🏆 Final Selected Model: Logistic Regression")

    # Save Best Model
    joblib.dump(final_model, "student_retention_model.pkl")
    print("✅ Best Model Saved Successfully!")

    return final_model