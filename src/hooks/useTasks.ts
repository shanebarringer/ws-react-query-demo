import { QueryClient, useQuery } from "react-query";
import useReactQuerySubscription from "./useReactQuerySubscription";
      

export const useTasks = (websocket: WebSocket, queryClient: QueryClient): { tasks: any[] | undefined; error: any; isLoading: boolean } => {
  queryClient.invalidateQueries("tasks");
  const { data, error, isLoading } = useQuery("tasks", () => {
    console.log("fetching tasks");
  }, {
    enabled: false,
  })

  useReactQuerySubscription(websocket, queryClient);
  console.log("useTasks", {data, error, isLoading});

  return {
    tasks: data as any[] | undefined,
    error,
    isLoading,
  };
};


export const updateTask = (task: any, websocket: WebSocket) => {
  console.log("updateTask", task);
  websocket.send(JSON.stringify({ action: "UPDATE_TASK", task }));
};

export const addTask = (task: any, websocket: WebSocket) => {
  console.log("addTask", task);
  websocket.send(JSON.stringify({ action: "ADD_TASK", task }));
}
