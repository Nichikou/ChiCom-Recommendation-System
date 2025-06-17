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

interface ChatBotProps {
  chatOpen: boolean;
}

interface Message {
  id: string;
  content: string;
  sender: "sent" | "received";
}

const INIT_MESSAGE: Message = {
  id: "initial-message",
  content: "Hello. I am an AI assistance. What can I help you?",
  sender: "received",
};

//Components Main Code
const ChatBot = ({ chatOpen }: ChatBotProps) => {
  //Hook for input field
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

  const handleMessage = useCallback(
    (message: string, senderType: "sent" | "received") => {
      const newMessage: Message = {
        id: Date.now().toString(),
        content: message,
        sender: senderType,
      };

      setMessageList((prev) => [...prev, newMessage]);

      if (senderType === "sent") {
        setUserText("");
        sendJSON(message);
      }
    },
    [userText]
  );

  //Handle message submission
  const handleFormSubmit = useCallback(
    (event: FormEvent) => {
      event.preventDefault();
      const trimmedText = userText.trim();

      if (!trimmedText) {
        return;
      }
      handleMessage(trimmedText, "sent");
    },
    [userText]
  );

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

        if (!response.ok) {
          console.log(response);
          throw new Error("API error");
        }

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
    [handleMessage]
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageList]);

  return (
    <AnimatePresence>
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

          <div className="chat-input">
            <form
              className="chat-input-wrapper"
              onSubmit={(event) => handleFormSubmit(event)}
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
