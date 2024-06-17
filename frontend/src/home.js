// home.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TodoList from "./TodoList"; // Import the TodoList component

const Home = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [recurringTasks, setRecurringTasks] = useState([]);
  const [completedRecurringTasks, setCompletedRecurringTasks] = useState([]);
  const [dailyStreak, setDailyStreak] = useState(0);

  useEffect(() => {
    // Check if the user is already logged in
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setLoggedIn(true);
      setEmail(user.email);
      fetchTasks(user.email);
    }
  }, []);

  const fetchTasks = (email) => {
    fetch(`http://localhost:3080/tasks?email=${email}`)
      .then((res) => res.json())
      .then((data) => {
        setTasks(data.tasks);
        setCompletedTasks(data.completedTasks);
        setRecurringTasks(data.recurringTasks);
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
      });
  };

  const onButtonClick = () => {
    if (loggedIn) {
      localStorage.removeItem("user");
      setLoggedIn(false);
      setEmail("");
      setTasks([]);
      setCompletedTasks([]);
      setRecurringTasks([]);
      setCompletedRecurringTasks([]);
      setDailyStreak(0);
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="mainContainer">
      <div className={"titleContainer"}>
        <div>Welcome</div>
      </div>
      {loggedIn ? (<div></div>):<div>Pls login to your account. If you dont have one, it will be registered.</ div>}
      {loggedIn ? (<div></div>):<div>Thankyou for Visiting!</ div>}
      {loggedIn && (
        <TodoList
          tasks={tasks}
          setTasks={setTasks}
          completedTasks={completedTasks}
          setCompletedTasks={setCompletedTasks}
          recurringTasks={recurringTasks}
          setRecurringTasks={setRecurringTasks}
          completedRecurringTasks={completedRecurringTasks}
          setCompletedRecurringTasks={setCompletedRecurringTasks}
          dailyStreak={dailyStreak}
          setDailyStreak={setDailyStreak}
        />
      )}
      <div></div>
      {loggedIn ? (
        <div className="email">Your email address is {email}</div>
      ) : (
        <div />
      )}
      <div className={"buttonContainer"}>
        <input
          className={"inputButton"}
          type="button"
          onClick={onButtonClick}
          value={loggedIn ? "Log out" : "Log in"}
        />
      </div>
    </div>
  );
};

export default Home;
