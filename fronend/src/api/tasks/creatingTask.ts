// import api from "@/config/axios"

// export const createTask = async (data: FormData) => {
//     const response = await api.post("/api/task/create",data)
//     console.log(data);
//     return response.data;
// };
import api from "@/config/axios";

// ===============================
// CREATE TASK
// ===============================

export const createTask = async (data: FormData) => {
  const response = await api.post("/api/task/create", data);

  console.log("Create Task Response:", response.data);

  return response.data;
};

export const updateTask = async (taskId: string, data: FormData) => {
  const response = await api.put(`/api/task/update/${taskId}`, data);

  console.log("Update Task Response:", response.data);

  return response.data;
};

// // ===============================
// // GET TASKS
// // ===============================

// export const getTask = async (date?: string) => {
//   const response = await api.get("/api/task/get", {
//     params: date ? { date } : {},
//   });

//   console.log("Get Tasks Response:", response.data);

//   return response.data;
// };