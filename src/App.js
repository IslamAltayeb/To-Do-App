import { useState, useEffect } from "react";
import { BrowserRouter,Routes, Route } from "react-router-dom";
import Header from "../src/components/Header";
import Footer from "../src/components/Footer";
import Tasks from "../src/components/Tasks";
import AddTask from "../src/components/AddTask";
import About from "../src/components/About";



function App() {
  const [showAddTask, setShowAddTask] = useState(false);
  const [tasks, setTasks] = useState([])

  //fetch data
  useEffect(()=>{
    const getTasks = async ()=> {
      const tasksFromServer = await fetchTasks()
      setTasks(tasksFromServer)
    }

    getTasks()
  },[])

  //fetch tasks
  const fetchTasks = async ()=>{
    const res = await fetch('http://localhost:5000/tasks')
    const data = await res.json()

    return data
  }

 //fetch tasks
 const fetchTask = async (id)=>{
  const res = await fetch(`http://localhost:5000/tasks/${id}`)
  const data = await res.json()

  return data
}

  //add task
  const addTask = async (task) => {
    // const id = Math.floor(Math.random()*10000) + 1
    // const newTask = {id, ...task}
    // setTasks([...tasks, newTask])
    const res = await fetch('http://localhost:5000/tasks',
     {method:'POST', headers: {'Content-type' : 'application/json'},
      body : JSON.stringify(task)})

      const data = await res.json()
      setTasks([...tasks, data])
    }
     
  

  //delete task
  const deleteTask = async (id)=>{
    await fetch(`http://localhost:5000/tasks/${id}`, {method:'DELETE'})
    setTasks(tasks.filter(task => task.id !== id));
  }

  //toggle reminder
  const toggleReminder = async (id) =>{
    const taskToToggle = await fetchTask(id)
    const updTask = {...taskToToggle , reminder : !taskToToggle.reminder}
    const res = await fetch(`http://localhost:5000/tasks/${id}`,
    {method:'PUT', 
     headers : {
      'Content-type' : 'application/json'
     },
     body : JSON.stringify(updTask) 
    })

    const data = res.json()

    setTasks(tasks.map(task => task.id === id ? {...task, reminder: data.reminder}: task))
  }

  return (
    <BrowserRouter>
    
    <div className="container">
    <Header onAdd={()=> setShowAddTask(!showAddTask)} showAdd={showAddTask} />     
      <Routes>
      <Route path="/" exact Component={(props) => (
        <>
            {showAddTask && <AddTask onAdd={addTask} />}
          {tasks.length > 0 ? (<Tasks tasks={tasks}
          onDelete={deleteTask}
          onToggle={toggleReminder} />) : ('no tasks to show')}
        </>
      )} />
      <Route path="/about" element={<About />} />
      </Routes>
      <Footer />
    </div>
    
    </BrowserRouter>
  );
}

export default App;
