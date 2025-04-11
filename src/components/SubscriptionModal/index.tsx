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
import { FiCheckCircle } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { subscriptionModalActions } from "@/store/slices/subscriptionPlanModal";

interface IProps {
  isOpen: boolean;
  onFinish: () => void;
}

const SubscriptionModal: React.FC<IProps> = ({ isOpen, onFinish }) => {
  const dispatch = useDispatch();
  const onClose = () => {
    dispatch(subscriptionModalActions.closeSubscriptionModal());
  };

  const handleFinish = () => {
    onFinish();
    // onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalContent backgroundColor="gray.700" color="white" maxW="700px">
        <ModalHeader borderBottomWidth="1px" borderColor="gray.200">
          Your plan
        </ModalHeader>
        <ModalCloseButton />
        <Flex>
          <FreePlan />
          <PlusPlan onFinish={handleFinish} />
        </Flex>
      </ModalContent>
    </Modal>
  );
};

const Feature: React.FC<{ feature: string; isPlusPlan?: boolean }> = ({
  feature,
  isPlusPlan = false,
}) => {
  return (
    <Flex alignItems="center" mb={2}>
      <FiCheckCircle
        size={20}
        style={{ stroke: isPlusPlan ? "#EA4335" : "" }}
      />
      <Text ml={1}>{feature}</Text>
    </Flex>
  );
};

const FreePlan = () => {
  return (
    <Flex
      flexDir="column"
      borderRightWidth="1px"
      borderColor="gray.200"
      p="12px 25px"
      fontSize={14}
      flex={1}
    >
      <Text
        fontSize="2xl"
        fontWeight="bold"
        textAlign="center"
        alignSelf="center"
      >
        Free plan
      </Text>
      <Button
        mt={4}
        mb={4}
        backgroundColor="gray.300"
        disabled
        color="black"
        cursor="default"
        width="100%"
      >
        Your current plan
      </Button>
      <Feature feature="Limited usage" />
      <Feature feature="Standard response speed" />
    </Flex>
  );
};

const PlusPlan: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
  return (
    <Flex flexDir="column" p="12px 25px" fontSize={14} flex={1}>
      <Flex justifyContent="space-between">
        <Text
          fontSize="2xl"
          fontWeight="bold"
        >
          
          Pro plan
        </Text>
        <Text
          fontSize="2xl"
          fontWeight="bold"
          color="gray.400"
        >
          $4.99/month
        </Text>
      </Flex>
      <Button
        mt={4}
        mb={4}
        backgroundColor="#EA4335"
        color="white"
        width="100%"
        onClick={onFinish}
      >
        Upgrade Plan
      </Button>
      <Feature feature="Unlimited usage" isPlusPlan={true} />
      <Feature feature="Faster response speed" isPlusPlan={true} />
      <Feature feature="Priority access to new features" isPlusPlan={true} />
    </Flex>
  );
};

export default SubscriptionModal;
