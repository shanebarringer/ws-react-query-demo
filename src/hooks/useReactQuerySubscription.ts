import { useEffect } from "react";
import { QueryClient } from "react-query";


const useReactQuerySubscription = (websocket: WebSocket, queryClient: QueryClient
  ) => {
  useEffect(() => {
    const connect = () => {
      websocket.onopen = () => {
        console.log("connected");
        websocket.send(JSON.stringify({ action: "FETCH_TASKS" }));
      };

      websocket.onclose = () => {
        console.log("WebSocket closed, reconnecting...");
        // Reconnect after a delay
        setTimeout(connect, 3000);
      };
      
      websocket.onerror = (error) => {
        console.log("WebSocket error:", error);
        console.error("WebSocket error:", error);
      };

      websocket.onmessage = (event) => {
        const {data} = JSON.parse(event.data);
          console.log("Received message:", data);
        console.log("Received tasks:", data.tasks);
        return queryClient.setQueryData("tasks", data);
      };
    };

    connect();

    return () => {
      websocket.close();
    };
  }, [ ]);
};

export default useReactQuerySubscription;