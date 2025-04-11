import { useSendChatMessageMutation } from "@/store/apis/chat";
import { useCreateCheckoutSessionMutation } from "@/store/apis/checkout-session";
import {
  Button,
  Flex,
  Text,
  Box,
  Input,
  IconButton,
  InputGroup,
  InputRightElement,
  Spinner,
  useDisclosure,
  Select,
} from "@chakra-ui/react";
import type { IHistory, IMessage } from "@/types/chat";
import { useCallback, useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { MdSend } from "react-icons/md";
import { HiOutlineFolderAdd } from "react-icons/hi";
import {
  useCreateChatMutation,
  useUpdateChatMutation,
  useGetChatQuery,
  useUpdateUserSubscriptionPlanMutation,
  useUpdateGeneralFeedbackMutation,
  useSetRemainingTokensMutation,
  useGetRemainingTokensQuery,
} from "@/store/apis/db";
import {
  useCurrentUserSelector,
  useCurrentChatSelector,
  userActions,
} from "@/store/slices/user";
import { useIsSubscriptionModalOpen } from "@/store/slices/subscriptionPlanModal";
import { useIsGeneralFeedbackModalOpen } from "@/store/slices/generalFeedbackModal";
import Messages from "@/views/Home/Messages";
import Suggestions from "@/views/Home/Suggestions";
import FeedbackModal from "@/components/FeedbackModal";
import SubscriptionModal from "@/components/SubscriptionModal";
import useCustomToast from "@/hooks/useCustomToast";
import { getStripe } from "@/utils/stripe-client";
import { LIMIT_TOKENS, PLAN_IDS } from "@/utils/constants";
import GeneralFeedbackModal from "@/components/GeneralFeedbackModal";
import { useDispatch } from "react-redux";

const Home = () => {
  const dispatch = useDispatch();
  const currentUser = useCurrentUserSelector();
  const currentChat = useCurrentChatSelector();
  const isSubscriptionModalOpen = useIsSubscriptionModalOpen();
  const isGeneralFeedbackModalOpen = useIsGeneralFeedbackModalOpen();
  const router = useRouter();
  const toast = useCustomToast();

  const [sendChatMessage, { isLoading: isSendChatMessageLoading }] =
    useSendChatMessageMutation();
  const [createChat, { isLoading: isCreateChatLoading }] =
    useCreateChatMutation();
  const [updateChat, { isLoading: isUpdateChatLoading }] =
    useUpdateChatMutation();
  const [createCheckoutSession, { isLoading: isCreateCheckoutSessionLoading }] =
    useCreateCheckoutSessionMutation();
  const [
    updateUserSubscriptionPlan,
    { isLoading: isUpdateUserSubscriptionPlanLoading },
  ] = useUpdateUserSubscriptionPlanMutation();
  const [updateGeneralFeedback, { isLoading: isUpdateGeneralFeedbackLoading }] =
    useUpdateGeneralFeedbackMutation();
  const [setRemainingTokens] = useSetRemainingTokensMutation();
  const { data: remainingTokens } = useGetRemainingTokensQuery({
    userId: currentUser?.uid as string,
  });

  const [amendment, setAmendment] = useState<string | null>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [history, setHistory] = useState<IHistory>([]);
  const [question, setQuestion] = useState<string>("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const {
    isOpen: isFeedbackModalOpen,
    onOpen,
    onClose: closeFeedbackModal,
  } = useDisclosure();
  const [submittingFeedbackMessageIdx, setSubmittingFeedbackMessageIdx] =
    useState<number>(-1);

  const handleSendMessage = () => {
    if (!question.trim()) return;
    sendMessage(question).catch((error) => {
      if (error.status === "FETCH_ERROR") {
        toast(
          "Network disconnected. Please check your internet connection.",
          "error"
        );
      } else {
        toast("An error occured. Please try again.", "error");
      }
      setMessages((pre) => pre.slice(0, -2));
    });
  };

  const sendMessage = useCallback(
    async (question: string) => {
      setMessages((pre) => [
        ...pre,
        { type: "user", text: question },
        { type: "bot-temp", text: "..." },
      ]);
      setQuestion("");

      try {
        // First call the custom endpoint
        const customEndpointResponse = await fetch(
          `http://16.16.110.150/query?message=${encodeURIComponent(question)}`
        );

        if (!customEndpointResponse.ok) {
          throw new Error("Custom endpoint request failed");
        }

        const customData = await customEndpointResponse.json();

        // If we have a response from custom endpoint, proceed with AI chat
        if (customData) {
          if (!remainingTokens) {
            setMessages((pre) => pre.slice(0, -1));
            toast("Insufficient tokens", "error");
            return;
          }

          const res = await sendChatMessage({
            question: question,
            history: history,
            amendment: amendment,
            customResponse: customData,
          }).unwrap();

          const { text, sourceDocuments, questionTokens, answerTokens } = res;
          if (remainingTokens !== LIMIT_TOKENS.PAID) {
            toast(`Tokens consumed: ${questionTokens + answerTokens}`, "info");
          }

          if (remainingTokens !== LIMIT_TOKENS.PAID) {
            await setRemainingTokens({
              userId: currentUser?.uid as string,
              tokens: remainingTokens - (questionTokens + answerTokens),
            }).unwrap();
          }

          setMessages((pre) => pre.slice(0, -1));
          setMessages((pre) => [
            ...pre,
            { type: "bot", text, sourceDocs: sourceDocuments },
          ]);
          setHistory((pre) => [...pre, [question, text]]);
          inputRef.current?.focus();

          const newMessages = [
            ...messages,
            { type: "user", text: question },
            { type: "bot", text, sourceDocs: sourceDocuments },
          ] as IMessage[];

          const newHistory = [...history, [question, text]] as IHistory;
          handleSaveChat(newMessages, newHistory);
        }
      } catch (error) {
        setMessages((pre) => pre.slice(0, -2));
        toast("An error occurred. Please try again.", "error");
        console.error("Error:", error);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [question, sendChatMessage, history, toast, remainingTokens]
  );

  const handleSaveChat = useCallback(
    async (messages: IMessage[], history: IHistory) => {
      if (!currentUser || !messages.length) return;

      if (!currentChat) {
        try {
          const chatName = messages[0].text;
          const data = {
            name: chatName,
            userId: currentUser.uid,
            messages,
            history,
            createdAt: new Date().toISOString(),
          };

          const { id } = await createChat({
            userId: currentUser.uid,
            data,
          }).unwrap();

          dispatch(userActions.setCurrentChat({ id, ...data }));
        } catch (err) {
          toast("Something went wrong.", "error");
        }
      } else {
        try {
          const res = await updateChat({
            userId: currentUser.uid,
            data: {
              ...currentChat,
              messages,
              history,
            },
          }).unwrap();
        } catch (err) {
          toast("Something went wrong.", "error");
        }
      }
    },
    [currentUser, currentChat, createChat, updateChat, toast, dispatch]
  );

  const handleSubmitFeedback = (rating: number, feedbackValue: string) => {
    const message = messages[submittingFeedbackMessageIdx];
    const newMessage = {
      ...message,
      rating,
      feedback: { ...message.feedback, reason: feedbackValue },
    };
    const newMessages = [...messages];
    newMessages[submittingFeedbackMessageIdx] = newMessage;
    setMessages(newMessages);
    handleCloseFeedBackModal();
  };

  const handleCloseFeedBackModal = () => {
    closeFeedbackModal();
    setSubmittingFeedbackMessageIdx(-1);
  };

  const handleSubmitGeneralFeedback = async (feedback: string) => {
    if (!currentUser) return;
    try {
      await updateGeneralFeedback({
        userId: currentUser.uid,
        feedback,
      }).unwrap();
      toast("Thank you for your feedback!", "success");
    } catch (err) {
      toast("Something went wrong.", "error");
    }
  };

  const handleClickLike = (messageIdx: number) => {
    setSubmittingFeedbackMessageIdx(messageIdx);
    onOpen();
    const message = messages[messageIdx];
    const newMessage = {
      ...message,
      feedback: { ...message.feedback, action: "like" },
    };
    const newMessages = [...messages];
    newMessages[messageIdx] = newMessage;
    setMessages(newMessages);
  };

  const handleClickDislike = (messageIdx: number) => {
    setSubmittingFeedbackMessageIdx(messageIdx);
    onOpen();
    const message = messages[messageIdx];
    const newMessage = {
      ...message,
      feedback: { ...message.feedback, action: "dislike" },
    };
    const newMessages = [...messages];
    newMessages[messageIdx] = newMessage;
    setMessages(newMessages);
  };

  const handleSelectSubscriptionPlan = async () => {
    try {
      const { sessionId } = await createCheckoutSession({
        priceId: PLAN_IDS.PLUS,
      }).unwrap();
      if (!sessionId) return;
      localStorage.setItem("checkoutSessionId", sessionId);
      const stripe = await getStripe();
      stripe?.redirectToCheckout({ sessionId });
    } catch (err) {
      const error = err as any;
      toast(error.message, "error");
    }
  };

  useEffect(() => {
    const updateSubscriptionPlan = async () => {
      const { session_id: redirectedCheckoutSessionId } = router.query;
      if (redirectedCheckoutSessionId) {
        const checkoutSessionId = localStorage.getItem("checkoutSessionId");
        if (redirectedCheckoutSessionId !== checkoutSessionId) return;
        if (!currentUser) return;
        localStorage.removeItem("checkoutSessionId");
        try {
          const res = await updateUserSubscriptionPlan({
            userId: currentUser.uid,
            plan: "paid",
          });
          toast("Payment successful!", "success");
        } catch (err) {
          const error = err as any;
          toast(error.message, "error");
        }
      }
    };
    updateSubscriptionPlan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query, currentUser]);

  useEffect(() => {
    if (currentChat) {
      setMessages(currentChat.messages);
      setHistory(currentChat.history);
    } else {
      setMessages([]);
      setHistory([]);
    }
  }, [currentChat]);

  const showMessages = !!currentChat?.id || !!messages.length;
  const showSuggestions = !showMessages;

  if (!currentUser)
    return (
      <Box p="1rem">
        <Spinner />
      </Box>
    );

  return (
    <>
      {submittingFeedbackMessageIdx >= 0 && (
        <FeedbackModal
          isOpen={isFeedbackModalOpen}
          onClose={handleCloseFeedBackModal}
          onSubmit={handleSubmitFeedback}
          rating={messages[submittingFeedbackMessageIdx]?.rating}
          feedbackReason={
            messages[submittingFeedbackMessageIdx]?.feedback?.reason
          }
        />
      )}
      <GeneralFeedbackModal
        isOpen={isGeneralFeedbackModalOpen}
        onSubmit={handleSubmitGeneralFeedback}
        isSubmitting={isUpdateGeneralFeedbackLoading}
      />
      <SubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onFinish={handleSelectSubscriptionPlan}
      />
      <Flex
        flexDir="column"
        gap="2rem"
        p="0.5rem 1rem 2rem"
        flex="1"
        minH="0"
        h="100%"
      >
        <Box flex="1" minH="0">
          {showSuggestions && (
            <Suggestions onSelectSuggestedQuestion={sendMessage} />
          )}
          {showMessages && (
            <Messages
              messages={messages}
              onClickDislike={handleClickDislike}
              onClickLike={handleClickLike}
            />
          )}
        </Box>
        <Flex
          gap="2rem"
          alignItems="flex-start"
          px={{
            base: "1rem",
            sm: "1rem",
            md: "1rem",
            xl: "5rem",
            "2xl": "5rem",
          }}
        >
          <Box flex="1">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
            >
              <Flex gap="1rem">
                <InputGroup>
                  <Input
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Send a message."
                    isDisabled={isSendChatMessageLoading}
                    maxHeight="10rem"
                    ref={inputRef}
                  />
                  <InputRightElement>
                    <IconButton
                      aria-label="send"
                      type="submit"
                      variant="ghost"
                      isLoading={isSendChatMessageLoading}
                      isDisabled={!question}
                    >
                      <MdSend />
                    </IconButton>
                  </InputRightElement>
                </InputGroup>
              </Flex>
              <Text
                fontSize="13px"
                color="#EA4335"
                pt="0.5rem"
                textAlign="center"
                display={{
                  base: "none",
                  sm: "none",
                  md: "none",
                  xl: "block",
                  "2xl": "block",
                }}
              >
                May at times produce inaccurate information. You should always
                still perform your due diligence
              </Text>
            </form>
          </Box>
          <Select
            fontSize="13px"
            fontWeight="medium"
            placeholder="Select Local Amendment"
            color="white"
            bgColor="#111827"
            width="auto"
            onChange={(e) => setAmendment(e.target.value)}
          >
            <option style={{ color: "initial" }} value="broward-county-2024">
              Broward County
            </option>
            <option style={{ color: "initial" }} value="city-of-naples-2024">
              City of Naples
            </option>
            <option style={{ color: "initial" }} value="marion-county-ldc-2024">
              Marion County
            </option>
            <option style={{ color: "initial" }} value="north-naples">
              North Naples
            </option>
            <option style={{ color: "initial" }} value="orange-county">
              Orange County
            </option>
          </Select>
        </Flex>
      </Flex>
    </>
  );
};

export default Home;
