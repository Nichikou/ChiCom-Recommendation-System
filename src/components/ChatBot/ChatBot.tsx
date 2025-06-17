import "./ChatBot.css";
import {
  useEffect,
  useRef,
  useState,
  useCallback,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { LuSend } from "react-icons/lu";
import { motion, AnimatePresence } from "framer-motion";

//Get chatOpen useState from ChatBotButton components
interface ChatBotProps {
  chatOpen: boolean;
}

//The structure of a message
interface Message {
  id: string;
  content: string;
  sender: "sent" | "received";
}

//Init message
const INIT_MESSAGE: Message = {
  id: "initial-message",
  content: "Hello. I am an AI assistance. How can I help you?",
  sender: "received",
};

//Components Main Code
const ChatBot = ({ chatOpen }: ChatBotProps) => {
  //Hook for input, list of messages and a for auto scrolling
  const [userText, setUserText] = useState<string>("");
  const [messageList, setMessageList] = useState<Message[]>([INIT_MESSAGE]);
  const bottomRef = useRef<HTMLDivElement>(null);

  //Update hook when input field changes
  const handleInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setUserText(event.target.value);
    },
    []
  );

  //Handle when user submit the message
  const handleSubmission = useCallback(
    (event: FormEvent) => {
      event.preventDefault();
      const trimmedText = userText.trim();

      if (!trimmedText) {
        return;
      }

      const newMessage: Message = {
        id: Date.now().toString(),
        content: trimmedText,
        sender: "sent",
      };

      //Append to message list
      setMessageList((prev) => [...prev, newMessage]);
      setUserText("");
      sendJSON(trimmedText);
    },
    [userText]
  );

  //Send an HTML POST to N8N
  const sendJSON = useCallback(
    async (message: string) => {
      try {
        const response = await fetch(
          "https://n8n-n8n.840pqj.easypanel.host/webhook/e3d8f10a-fafd-4cee-8df4-4efe1d47e019",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ message: message }),
          }
        );

        //Throw error if received an error
        if (!response.ok) {
          console.log(response);
          throw new Error("API error");
        }

        //Retrieve respond and print it on the screen
        const responseData = await response.json();
        setMessageList((prev) => [
          ...prev,
          {
            id: responseData.messageID,
            content: responseData.message,
            sender: "received",
          },
        ]);
      } catch (err) {
        //Print out Error Message
        if (err instanceof Error) {
          setMessageList((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              content: err.message,
              sender: "received",
            },
          ]);
        }
      }
    },
    [handleSubmission]
  );

  //Automatically scroll to the bottom of the chat area
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageList]);

  return (
    <AnimatePresence>
      {/*Only execute when chatOpen is true*/}
      {chatOpen && (
        <motion.div
          key="chat-window"
          initial={{ x: 350, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 350, opacity: 0 }}
          transition={{
            duration: 0.25,
            ease: "easeInOut",
          }}
          className="chat-window"
        >
          {/*Chat Header*/}
          <header>
            <div>
              <img src="https://chicom.vn/static/media/Ellipse.b5e99880.png" />
              <span>ChiCom</span>
            </div>
          </header>

          {/*Chat Message Area*/}
          <div className="chat-area">
            {messageList.map((message) => (
              <motion.div
                key={message.id}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className={`message ${message.sender}`}
              >
                <div className="message-bubble">{message.content}</div>
              </motion.div>
            ))}

            <div ref={bottomRef} />
          </div>

          {/*User input*/}
          <div className="chat-input">
            <form
              className="chat-input-wrapper"
              onSubmit={(event) => handleSubmission(event)}
            >
              {/*Input Area*/}
              <input
                type="text"
                placeholder="Type a message..."
                value={userText}
                autoComplete="off"
                onChange={handleInputChange}
              ></input>

              {/*Submit Button*/}
              <motion.button
                type="submit"
                {...(userText.trim() && {
                  whileHover: { scale: 1.05 },
                  whileTap: { scale: 0.9 },
                })}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                aria-label="Send Message"
                className={userText.trim() === "" ? "no-text" : "has-text"}
              >
                <LuSend className="send-icon" />
              </motion.button>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatBot;
