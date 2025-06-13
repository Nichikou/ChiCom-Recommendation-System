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
  const [textValue, setTextValue] = useState("");
  const [messageList, setMessageList] = useState<Message[]>([INIT_MESSAGE]);
  const bottomRef = useRef<HTMLDivElement>(null);

  //Update hook when input field changes
  const handleInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setTextValue(event.target.value);
    },
    []
  );

  //Handle message submission
  const handleSendMessage = useCallback(
    (event: FormEvent) => {
      event.preventDefault();

      const trimmedText = textValue.trim();

      if (!trimmedText) {
        return;
      }

      const newMessage: Message = {
        id: Date.now().toString(),
        content: textValue,
        sender: "sent",
      };

      setMessageList((prev) => [...prev, newMessage]);
      setTextValue("");
    },
    [textValue]
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
            <h2>Customer Service</h2>
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
              onSubmit={(event) => handleSendMessage(event)}
            >
              {/*Input Area*/}
              <input
                type="text"
                placeholder="Type a message..."
                value={textValue}
                autoComplete="off"
                onChange={handleInputChange}
              ></input>

              {/*Submit Button*/}
              <motion.button
                type="submit"
                {...(textValue.trim() && {
                  whileHover: { scale: 1.05 },
                  whileTap: { scale: 0.9 },
                })}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                aria-label="Send Message"
                className={textValue.trim() === "" ? "no-text" : "has-text"}
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
