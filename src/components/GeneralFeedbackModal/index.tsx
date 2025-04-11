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
import { useDispatch } from "react-redux";
import { generalFeedbackModalActions } from "@/store/slices/generalFeedbackModal";

interface IProps {
  isOpen: boolean;
  onSubmit: (feedback: string) => Promise<void>;
  isSubmitting: boolean;
}

const GeneralFeedbackModal: React.FC<IProps> = ({
  isOpen,
  onSubmit,
  isSubmitting,
}) => {
  const [feedback, setFeedbackValue] = useState<string>("");
  const dispatch = useDispatch();

  const onClose = () => {
    dispatch(generalFeedbackModalActions.closeGeneralFeedbackModal());
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFeedbackValue(e.target.value);
  };

  const handleSubmit = async () => {
    await onSubmit(feedback);
    setFeedbackValue("");
    onClose();
  };

  const isSubmitBtnDisabled = !feedback;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Please provide your general feedback</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Input placeholder="Your feedback" onChange={handleChange} />
        </ModalBody>
        <ModalFooter>
          <Button
            backgroundColor="#EA4335"
            color="white"
            isDisabled={isSubmitBtnDisabled}
            isLoading={isSubmitting}
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default GeneralFeedbackModal;
