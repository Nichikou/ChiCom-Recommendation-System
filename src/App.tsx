import "./App.css";
import ChiCom from "./components/ChiComMain/ChiComMain";
import ChatBotLogo from "./components/ChatBotButton/ChatBotButton";
import ChatBot from "./components/ChatBot/ChatBot";
import { useState } from "react";

function App() {
  const [chatOpen, setClickState] = useState(false);
  return (
    <>
      <ChiCom />
      <ChatBotLogo chatOpen={chatOpen} setClickState={setClickState} />
      <ChatBot chatOpen={chatOpen} />
    </>
  );
}

export default App;
