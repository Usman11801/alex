import { Flex, IconButton } from "@chakra-ui/react";
import { BsHandThumbsUp, BsHandThumbsDown } from "react-icons/bs";

type Props = {
  onClickLike: () => void;
  onClickDislike: () => void;
  feedbackActionValue: string | undefined;
};

const FeedbackActions: React.FC<Props> = ({
  onClickLike,
  onClickDislike,
  feedbackActionValue,
}) => {
  const isLiked = feedbackActionValue === "like";
  const isDisliked = feedbackActionValue === "dislike";

  return (
    <Flex
      position="absolute"
      top="-2.25rem"
      right="1rem"
      bgColor="gray.200"
      justifyContent="center"
      w="fit-content"
      borderRadius="lg"
    >
      <IconButton
        onClick={onClickLike}
        aria-label="like"
        variant="ghost"
        backgroundColor={isLiked ? "green.500" : ""}
        icon={
          <BsHandThumbsUp
            size="1.25rem"
            color={isLiked ? "white" : "green.500"}
          />
        }
        w="fit-content"
      />
      <IconButton
        onClick={onClickDislike}
        aria-label="like"
        variant="ghost"
        backgroundColor={isDisliked ? "red.500" : ""}
        icon={
          <BsHandThumbsDown
            size="1.25rem"
            color={isDisliked ? "white" : "red.500"}
          />
        }
        w="fit-content"
      />
    </Flex>
  );
};

export default FeedbackActions;
