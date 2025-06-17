import "./ChatBotButton.css";
import { RiCustomerServiceLine } from "react-icons/ri";
import { AiOutlineClose } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";

//Values for animations
const iconVariants = {
  initial: {
    rotate: "180deg",
    opacity: 0,
    scale: 0,
  },
  animate: {
    rotate: "360deg",
    opacity: 1,
    scale: 1,
  },
  exit: {
    rotate: "540deg",
    opacity: 0,
    scale: 0,
  },
};

//Value for transition
const iconTransition = {
  duration: 0.125,
  ease: "easeInOut",
};

interface ChatBotButtonProps {
  chatOpen: boolean;
  setClickState: Function;
}

const ChatBotButton = ({ chatOpen, setClickState }: ChatBotButtonProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      transition={iconTransition}
      className="chatBotIcon"
      onClick={() => setClickState(!chatOpen)}
    >
      <AnimatePresence mode="popLayout">
        <motion.div
          key={chatOpen ? "closeIcon" : "chatIcon"}
          variants={iconVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={iconTransition}
          className="iconWrapper"
        >
          {chatOpen ? (
            <AiOutlineClose className="icon" />
          ) : (
            <RiCustomerServiceLine className="icon" />
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default ChatBotButton;
