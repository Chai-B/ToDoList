// login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const navigate = useNavigate();

    const onButtonClick = () => {
        // Set initial error values to empty
        setEmailError("");
        setPasswordError("");

        // Check if the user has entered both fields correctly
        if (email === "") {
            setEmailError("Please enter your email");
            return;
        }

        if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            setEmailError("Please enter a valid email");
            return;
        }

        if (password === "") {
            setPasswordError("Please enter a password");
            return;
        }

        if (password.length < 8) {
            setPasswordError("The password must be 8 characters or longer");
            return;
        }

        // Check if email has an account associated with it
        checkAccountExists((accountExists) => {
            // If yes, log in
            if (accountExists) {
                logIn();
            } else {
                // Else, ask user if they want to create a new account and if yes, then log in
                if (window.confirm("An account does not exist with this email address: " + email + ". Do you want to create a new account?")) {
                    logIn();
                }
            }
        });
    };

    // Call the server API to check if the given email ID already exists
    const checkAccountExists = (callback) => {
        fetch("http://localhost:3080/check-account", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        })
            .then((r) => r.json())
            .then((r) => {
                callback(r?.userExists);
            });
    };

    // Log in a user using email and password
    const logIn = () => {
        fetch("http://localhost:3080/auth", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        })
            .then((r) => r.json())
            .then((r) => {
                if (r.message === 'success') {
                    localStorage.setItem("user", JSON.stringify({ email, token: r.token }));
                    navigate("/");
                    window.location.reload(); // Reload the page to trigger the useEffect in Home.js
                } else {
                    window.alert("Wrong email or password");
                }
            });
    };

    return (
        <div className={"mainContainer"}>
            <div className={"titleContainer"}>
                <div>Login</div>
            </div>
            <div><h3>Enter your credentials</h3></div>
            <br />
            <div className={"inputContainer"}>
                <input
                    value={email}
                    placeholder="Email@xyz.com"
                    onChange={(ev) => setEmail(ev.target.value)}
                    className={"inputBox"}
                />
                <label className="errorLabel">{emailError}</label>
            </div>
            <br />
            <div className={"inputContainer"}>
                <input
                    type="password"
                    value={password}
                    placeholder="Password"
                    onChange={(ev) => setPassword(ev.target.value)}
                    className={"inputBox"}
                />
                <label className="errorLabel">{passwordError}</label>
            </div>
            <br />
            <div className={"inputContainer"}>
                <input
                    className={"inputButton"}
                    type="button"
                    onClick={onButtonClick}
                    value={"Submit"}
                />
            </div>
        </div>
    );
};

export default Login;
