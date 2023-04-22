import { useState } from 'react'
import { useQueryClient } from "react-query";
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { addTask, updateTask, useTasks } from './hooks/useTasks';



function App() {
  const websocket = new WebSocket("ws://localhost:8081/");

  const [count, setCount] = useState(0)
  const queryClient = useQueryClient();
  const { tasks, error, isLoading } = useTasks(websocket, queryClient);

const handleCheckboxChange = (task: any) => {
  const updatedTask = { ...task, completed: !task.completed };
  updateTask(updatedTask, websocket);
  queryClient.invalidateQueries("tasks");

};


  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
          <div>
      <h2>Tasks</h2>
      <ul>
       {tasks?.map((task: any) => (
          <li key={task.uuid}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => {
                console.log("updating")
                handleCheckboxChange(task);
              }}
            />
            {task.name}
          </li>
        ))}
      </ul>
      <input
        type="text"
        placeholder="Add a new task"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            const newTask = {
              uuid: Math.random().toString(36).substring(7),
              name: e.currentTarget.value,
              completed: false,
            };
            console.log("adding TASK: ", newTask)
            addTask(newTask, websocket);
            e.currentTarget.value = "";
            queryClient.invalidateQueries("tasks");
          }
        }}
      />

    </div>
    </>
  )
}

export default App
