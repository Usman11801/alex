import { Box, Flex, Text } from "@chakra-ui/react";
import { BsXDiamond } from "react-icons/bs";
import { BiMessageDetail } from "react-icons/bi";
import { GoPencil } from "react-icons/go";

export const SUGGESTED_QUESTIONS = {
  SQ_1: {
    value:
      "Calculate the occupancy load of a new assemblely that is 1500 square feet.",
    icon: <GoPencil />,
    description: "Ask complex questions and reference tables",
  },
  SQ_2: {
    value:
      "Show me all codes from 69a that reference schools. Ensure to include their code references.",
    icon: <BiMessageDetail />,
    description: "Cite code with ease ",
  },
  SQ_3: {
    value: "As of now this model is trained on NFPA 1, 101, Florida 633 & 69A?",
    icon: <BsXDiamond />,
    description: "Limitations ",
  },
};

interface SuggestedQuestionProps {
  onSelect: (question: string) => void;
  value: string;
  icon: React.ReactNode;
  description: string;
}

const SuggestedQuestion: React.FC<SuggestedQuestionProps> = ({
  value,
  icon,
  description,
  onSelect,
}) => {
  return (
    <Flex flexDir="column" alignItems="center" maxWidth={400}>
      <Flex alignItems="center" mb={17}>
        <Flex
          backgroundColor="gray.200"
          w="40px"
          h="40px"
          borderRadius={100}
          justifyContent="center"
          alignItems="center"
          mr={2}
          display={{
            base: "none",
            sm: "none",
            md: "none",
            lg: "flex",
            xl: "flex",
            "2xl": "flex",
          }}
        >
          {icon}
        </Flex>
        <Text
          fontSize={13}
          display={{
            base: "none",
            sm: "none",
            md: "none",
            xl: "block",
            "2xl": "block",
          }}
          fontWeight="bold"
        >
          {description}
        </Text>
      </Flex>
      <Box
        padding="25px"
        borderColor="gray.300"
        borderWidth={1}
        borderRadius={16}
        cursor="pointer"
        onClick={() => onSelect(value)}
        fontSize={{
          base: "10px",
          sm: "10px",
          md: "10px",
          xl: "13px",
          "2xl": "13px",
        }}
      >
        <Text fontSize={13}>&ldquo;{value}&rdquo;</Text>
      </Box>
    </Flex>
  );
};

interface SuggestionsProps {
  onSelectSuggestedQuestion: (question: string) => void;
}

const Suggestions: React.FC<SuggestionsProps> = ({
  onSelectSuggestedQuestion,
}) => {
  return (
    <Flex
      flexDir="column"
      h="100%"
      alignItems="center"
      justifyContent="center"
      padding={30}
    >
      <Text mb={{ base: 10, sm: 10, md: 10, xl: 20, "2xl": 20 }}>
        Your personal AI building code assistant
      </Text>
      <Flex
        w="100%"
        justifyContent="space-between"
        flexDirection={{
          base: "column",
          sm: "column",
          md: "column",
          lg: "row",
          xl: "row",
          "2xl": "row",
        }}
      >
        {Object.values(SUGGESTED_QUESTIONS).map((question, index) => (
          <SuggestedQuestion
            key={index}
            {...question}
            onSelect={onSelectSuggestedQuestion}
          />
        ))}
      </Flex>
    </Flex>
  );
};

export default Suggestions;
