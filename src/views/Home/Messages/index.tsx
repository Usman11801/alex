import { Flex } from "@chakra-ui/react";
import type { IMessage } from "@/types/chat";
import { useRef, useEffect, FC } from "react";
import MessageDisplay from "@/views/Home/Messages/MessageDisplay";

type MessagesProps = {
  messages: IMessage[];
  onClickLike: (idx: number) => void;
  onClickDislike: (idx: number) => void;
};
const Messages: FC<MessagesProps> = ({
  messages,
  onClickDislike,
  onClickLike,
}) => {
  const messageContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "end",
      });
    }
  }, [messages, messageContainerRef]);

  return (
    <Flex
      flexDir="column"
      h="100%"
      border="1px"
      borderRadius="lg"
      borderColor="gray.200"
      overflow="auto"
    >
      {messages.map((msg, idx) => {
        const isLastMessage = idx === messages.length - 1;

        const handleClickLike = () => {
          onClickLike(idx);
        };

        const handleClickDislike = () => {
          onClickDislike(idx);
        };

        return (
          <MessageDisplay
            key={`${msg.text}_${Date.now().toString()}_${idx}`}
            ref={isLastMessage ? messageContainerRef : null}
            message={msg}
            onClickDislike={handleClickDislike}
            onClickLike={handleClickLike}
          />
        );
      })}
    </Flex>
  );
};

export default Messages;
