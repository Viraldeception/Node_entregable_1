const express = require("express");
const path = require("path");
const fs = require("fs/promises");
const app = express();
app.use(express.json());

const jsonPath = path.resolve("./files/tasks.json");

//Obtener el JSON
app.get("/tasks", async (req, res) => {
  //obtener el json
  const jsonFile = await fs.readFile(jsonPath, "utf-8");
  //enviar la respuesta
  res.send(jsonFile);
});

app.post("/tasks", async (req, res) => {
  //enviar la informacion al body de la peticion
  const task = req.body;
  //obtener el arreglo del JSON File
  const tasksArray = JSON.parse(await fs.readFile(jsonPath, "utf-8"));
  //agregar tarea
  //generar nuevo ID
  const lastIndex = tasksArray.length - 1;
  const newId = tasksArray[lastIndex].id + 1;
  console.log(newId);
  tasksArray.push({ ...task, id: newId });
  //escribir la informacion en el json
  await fs.writeFile(jsonPath, JSON.stringify(tasksArray));
  res.send();
});

//Actualizacion de tareas
//Actualizacion de informacion de tareas
app.put("/tasks", async (req, res) => {
  //Obtener las tareas
  const tasksArray = JSON.parse(await fs.readFile(jsonPath, "utf-8"));
  const { id, title, description, status } = req.body;
  //buscar el ID de la tarea
  const taskIndex = tasksArray.findIndex((task) => task.id === id);
  if (taskIndex >= 0) {
    tasksArray[taskIndex].status = status;
  }
  //reescribir el estatus de la tarea
  await fs.writeFile(jsonPath, JSON.stringify(tasksArray));
  res.send("status de tarea actualizada");
});

app.delete("/tasks", async (req, res) => {
  //obtener las tareas
  const tasksArray = JSON.parse(await fs.readFile(jsonPath, "utf-8"));
  const { id } = req.body;

  //encontrar el id de la tarea
  const taskIndex = tasksArray.findIndex((task) => task.id === id);

  //eliminar tarea
  tasksArray.splice(taskIndex, 1);

  //se reescribe el json
  await fs.writeFile(jsonPath, JSON.stringify(tasksArray));
  res.send();
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`API de tareas escuchando en el puerto ${PORT}`);
});
