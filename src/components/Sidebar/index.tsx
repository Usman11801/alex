import {
  Flex,
  Input,
  Text,
  InputGroup,
  InputLeftElement,
  InputProps,
  Spinner,
  Box,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { Button } from "@chakra-ui/react";
import { FC, Fragment, useState } from "react";
import { MdAddCircleOutline, MdSend, MdDeleteForever } from "react-icons/md";
import { FiSearch } from "react-icons/fi";
import { RiAccountCircleLine } from "react-icons/ri";
import {
  useGetChatsQuery,
  useGetUserSubscriptionPlanQuery,
  useDeleteChatMutation,
} from "@/store/apis/db";
import { useCurrentChatSelector, useCurrentUserSelector } from "@/store/slices/user";
import { useDispatch } from "react-redux";
import { userActions } from "@/store/slices/user";
import { subscriptionModalActions } from "@/store/slices/subscriptionPlanModal";
import { User } from "firebase/auth";
import { USER_TIERS } from "@/utils/constants";
import { generalFeedbackModalActions } from "@/store/slices/generalFeedbackModal";
import useCustomToast from "@/hooks/useCustomToast";

const Sidebar = () => {
  const dispatch = useDispatch();
  const currentUser = useCurrentUserSelector();
  const [search, setSearch] = useState("");

  const {
    data: currentUserSubscriptionPlan,
    isLoading: isGetUserSubscriptionPlanLoading,
    isFetching: isGetUserSubscriptionPlanFetching,
  } = useGetUserSubscriptionPlanQuery({ userId: currentUser?.uid as string });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const isGettingUserPlan =
    isGetUserSubscriptionPlanLoading || isGetUserSubscriptionPlanFetching;

  const showSubscriptionButton =
    currentUserSubscriptionPlan !== USER_TIERS.PAID;

  return (
    <Flex p="2rem 1.5rem" flexDir="column" h="100%" bgColor="#111827">
      <Button
        leftIcon={<MdAddCircleOutline />}
        bgColor="#EA4335"
        color="white"
        fontSize="13px"
        _hover={{
          color: "#111827",
        }}
        onClick={() => dispatch(userActions.setCurrentChat(null))}
      >
        New Chat
      </Button>
      <Flex flexDir="column" flex="1" overflow="hidden" w="100%">
        <SearchInput value={search} onChange={handleChange} />
        <Conversations currentUser={currentUser} searchValue={search} />
      </Flex>

      {showSubscriptionButton && (
        <Button
          isLoading={isGettingUserPlan}
          leftIcon={<RiAccountCircleLine />}
          mx="auto"
          mb={2}
          mt={10}
          onClick={() => {
            dispatch(subscriptionModalActions.openSubscriptionModal());
          }}
        >
          Upgrade to plus
        </Button>
      )}
      <Button
        rightIcon={<MdSend />}
        bgColor="#181F2E"
        color="white"
        fontSize="11px"
        w="fit-content"
        mx="auto"
        _hover={{
          color: "#EA4335",
        }}
        onClick={() =>
          dispatch(generalFeedbackModalActions.openGeneralFeedbackModal())
        }
      >
        Submit Feedback
      </Button>
    </Flex>
  );
};

type SearchInputProps = InputProps & {};
const SearchInput: FC<SearchInputProps> = ({ ...inputProps }) => {
  return (
    <InputGroup my="3rem">
      <InputLeftElement>
        <FiSearch color="white" size="1.25rem" />
      </InputLeftElement>
      <Input
        variant="filled"
        fontSize="14px"
        fontWeight="700"
        bgColor="#181F2E"
        color="white"
        placeholder="Search"
        _placeholder={{
          color: "white",
        }}
        _hover={{
          borderColor: "white",
          bgColor: "#181F2E",
        }}
        {...inputProps}
      />
    </InputGroup>
  );
};

interface ConversationsProps {
  currentUser: User | null;
  searchValue: string;
}

const Conversations: React.FC<ConversationsProps> = ({
  currentUser,
  searchValue,
}) => {
  const dispatch = useDispatch();
  const toast = useCustomToast();
  const {
    data: chats = [],
    isLoading: isGetChatsLoading,
    isFetching: isGetChatsFetching,
    refetch,
  } = useGetChatsQuery(
    {
      userId: currentUser?.uid as string,
    },
    {
      skip: !currentUser?.uid,
    }
  );
  const [deleteChat] = useDeleteChatMutation();
  const currentChat = useCurrentChatSelector();

  const isLoading = isGetChatsFetching || isGetChatsLoading;

  const handleDeleteChat = async (chatId: string) => {
    await deleteChat({
      chatId,
      userId: currentUser?.uid as string,
    }).unwrap();
    if (chatId === currentChat?.id) {
      dispatch(userActions.setCurrentChat(null));
    }
    refetch();
    toast("Chat deleted successfully", "success");
  };

  const filteredChats = searchValue
    ? chats.filter((chat) =>
        chat.name.toLowerCase().includes(searchValue.toLowerCase())
      )
    : chats;

  return (
    <Flex flexDir="column" gap="1rem" flex={1} overflowY="auto">
      {isLoading && <Spinner color="white" size="sm" alignSelf="center" />}
      {!!filteredChats.length ? (
        filteredChats.map((chat, idx) => (
          <Box key={idx} w="100%">
            <Text
              textTransform="uppercase"
              color="white"
              fontSize="9px"
              fontWeight="700"
              textAlign="left"
            >
              {chat.createdAt && dayjs(chat.createdAt).format("MM/DD/YYYY")}
            </Text>
            <Flex
              color="white"
              bgColor="#181F2E"
              borderRadius="lg"
              key={chat.id}
              cursor="pointer"
              justifyContent="space-between"
              alignItems="center"
              p="1rem"
              gap="1rem"
              onClick={() => dispatch(userActions.setCurrentChat(chat))}
            >
              <Text
                fontSize="11px"
                lineHeight="100%"
                fontWeight="500"
              >
                {chat.name}
              </Text>
              <Button
                variant="ghost"
                minW="none"
                h="24px"
                w="24px"
                color="red.400"
                p="0"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteChat(chat.id);
                }}
              >
                <MdDeleteForever size="1.25rem" />
              </Button>
            </Flex>
          </Box>
        ))
      ) : (
        <Text
          textTransform="uppercase"
          color="white"
          fontSize="9px"
          fontWeight="700"
          textAlign="center"
        >
          No related chat found
        </Text>
      )}
    </Flex>
  );
};

export default Sidebar;
