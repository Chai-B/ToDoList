import React, { useState, useEffect } from "react";
import "./TodoList.css";
import DaysNavigation from "./DaysNavigation"; // Import DaysNavigation

const TodoList = ({ email }) => {
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [recurringTasks, setRecurringTasks] = useState([]);
  const [completedRecurringTasks, setCompletedRecurringTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [dailyStreak, setDailyStreak] = useState(0);
  const [selectedDay, setSelectedDay] = useState(new Date().toDateString());
  const [isRecurring, setIsRecurring] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, [email, selectedDay]);

  const fetchTasks = () => {
    fetch(`http://localhost:3080/tasks?email=${email}&day=${selectedDay}`)
      .then((res) => res.json())
      .then((data) => {
        setTasks(data.tasks || []);
        setCompletedTasks(data.completedTasks || []);
        setRecurringTasks(data.recurringTasks || []);
        setCompletedRecurringTasks(data.completedRecurringTasks || []);
        setDailyStreak(data.dailyStreak || 0);
      });
  };

  const addTask = () => {
    if (newTask.trim() === "") return;

    const taskData = {
      email,
      task: newTask,
      isRecurring,
      day: selectedDay
    };

    fetch("http://localhost:3080/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(taskData)
    })
    .then((res) => res.json())
    .then((data) => {
      if (isRecurring) {
        setRecurringTasks([...recurringTasks, newTask]);
      } else {
        setTasks([...tasks, newTask]);
      }
      setNewTask("");
      setIsRecurring(false); // Reset the checkbox after adding a task
    });
  };

  const completeTask = (index) => {
    const taskToComplete = tasks[index];

    fetch(`http://localhost:3080/tasks/complete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, task: taskToComplete, day: selectedDay })
    })
    .then((res) => res.json())
    .then((data) => {
      let updatedTasks = tasks.filter((_, i) => i !== index);
      let updatedCompletedTasks = [...completedTasks, taskToComplete];

      setTasks(updatedTasks);
      setCompletedTasks(updatedCompletedTasks);
      setDailyStreak(dailyStreak + 1);
    });
  };

  const completeRecurringTask = (task) => {
    fetch(`http://localhost:3080/recurring-tasks/complete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, task })
    })
    .then((res) => res.json())
    .then((data) => {
      setCompletedRecurringTasks([...completedRecurringTasks, task]);
      let updatedCompletedTasks = [...completedTasks, task];
      setCompletedTasks(updatedCompletedTasks);
      setDailyStreak(dailyStreak + 1);
    });
  };

  const removeRecurringTask = (task) => {
    fetch(`http://localhost:3080/recurring-tasks/remove`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, task })
    })
    .then((res) => res.json())
    .then((data) => {
      let updatedRecurringTasks = recurringTasks.filter((t) => t !== task);
      setRecurringTasks(updatedRecurringTasks);
      let updatedCompletedRecurringTasks = completedRecurringTasks.filter((t) => t !== task);
      setCompletedRecurringTasks(updatedCompletedRecurringTasks);
    });
  };

  return (
    <div className="todo-container">
      <h2>To-Do List</h2>
      <DaysNavigation selectedDay={selectedDay} setSelectedDay={setSelectedDay} /> {/* Add DaysNavigation */}
      <h3>Tasks for {selectedDay}</h3>
      <ul>
        {tasks.map((task, index) => (
          <li key={index}>
            {task}{" "}
            <button onClick={() => completeTask(index)}>Complete</button>
          </li>
        ))}
      </ul>
      <input
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="New task"
      />
      <label>
        <input
          type="checkbox"
          checked={isRecurring}
          onChange={() => setIsRecurring(!isRecurring)}
        />
        Recurring
      </label>
      <button onClick={addTask}>Add Task</button>

      <h3>Completed Tasks</h3>
      <ul>
        {completedTasks.map((task, index) => (
          <li key={index} className="completed">{task}</li>
        ))}
      </ul>

      <h3>Recurring Tasks</h3>
      <ul>
        {recurringTasks.map((task, index) => (
          <li key={index}>
            {task}{" "}
            {!completedRecurringTasks.includes(task) && (
              <button onClick={() => completeRecurringTask(task)}>Complete</button>
            )}
            <button onClick={() => removeRecurringTask(task)}>Remove</button>
          </li>
        ))}
      </ul>

      <h3>Daily Streak: {dailyStreak} days</h3>
    </div>
  );
};

export default TodoList;
