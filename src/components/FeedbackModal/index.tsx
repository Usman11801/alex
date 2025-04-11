import React, { useState } from "react";
import {
  Flex,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
  Input,
} from "@chakra-ui/react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, feedbackValue: string) => void;
  rating?: number;
  feedbackReason?: string;
};

const ratings = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const FeedbackModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSubmit,
  rating = 0,
  feedbackReason = "",
}) => {
  const [ratingState, setRating] = useState<number>(rating);
  const [feedbackValue, setFeedbackValue] = useState<string>(feedbackReason);
  const isSubmitDisabled = ratingState === 0 || feedbackValue === "";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFeedbackValue(e.target.value);
  };
  const handleSubmit = () => {
    onSubmit(ratingState, feedbackValue);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Please provide your feedback</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text mb={2}>Satisfaction level</Text>
          <Flex
            mb={4}
            justifyContent="space-between"
            display={{
              base: "none",
              sm: "none",
              md: "none",
              xl: "flex",
              "2xl": "flex",
            }}
          >
            {ratings.map((ratingItem) => {
              const isActive = ratingItem === ratingState;
              return (
                <Button
                  key={ratingItem}
                  padding={4}
                  backgroundColor={isActive ? "#EA4335" : ""}
                  color={isActive ? "white" : ""}
                  onClick={() => setRating(ratingItem)}
                >
                  {ratingItem}
                </Button>
              );
            })}
          </Flex>
          <Flex
            mb={4}
            justifyContent="space-between"
            display={{
              base: "flex",
              sm: "flex",
              md: "flex",
              xl: "none",
              "2xl": "none",
            }}
          >
            {ratings.slice(0, 5).map((ratingItem) => {
              const isActive = ratingItem === ratingState;
              return (
                <Button
                  key={ratingItem}
                  padding={4}
                  backgroundColor={isActive ? "#EA4335" : ""}
                  color={isActive ? "white" : ""}
                  onClick={() => setRating(ratingItem)}
                >
                  {ratingItem}
                </Button>
              );
            })}
          </Flex>
          <Flex
            mb={4}
            justifyContent="space-between"
            display={{
              base: "flex",
              sm: "flex",
              md: "flex",
              xl: "none",
              "2xl": "none",
            }}
          >
            {ratings.slice(5, 10).map((ratingItem) => {
              const isActive = ratingItem === ratingState;
              return (
                <Button
                  key={ratingItem}
                  padding={4}
                  backgroundColor={isActive ? "#EA4335" : ""}
                  color={isActive ? "white" : ""}
                  onClick={() => setRating(ratingItem)}
                >
                  {ratingItem}
                </Button>
              );
            })}
          </Flex>
          <Text mb={2}>Feedback</Text>
          <Input
            placeholder="Your feedback"
            value={feedbackValue}
            onChange={handleChange}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            isDisabled={isSubmitDisabled}
            backgroundColor="#EA4335"
            color="white"
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default FeedbackModal;
