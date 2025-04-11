import {
  Flex,
  Text,
  Box,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Spinner,
  Code,
} from "@chakra-ui/react";
import type { IMessage } from "@/types/chat";
import { forwardRef, memo, DetailedHTMLProps, HTMLAttributes } from "react";
import { BsRobot, BsPerson } from "react-icons/bs";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import remarkGfm from "remark-gfm";
import FeedbackActions from "@/views/Home/Messages/FeedbackActions";
import { CodeProps, ReactMarkdownProps } from "react-markdown/lib/ast-to-react";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import remarkMath from "remark-math";
import { codeLanguageSubset } from "@/utils/constants";
import CodeBlock from "@/views/Home/Messages/MessageDisplay/CodeBlock";
import 'katex/dist/katex.min.css';

type MessageDisplayProps = {
  message: IMessage;
  isLastMessage?: boolean;
  onClickLike: () => void;
  onClickDislike: () => void;
};

const preprocessLaTeX = (content: string) => {
  return content
    .replace(/\\\[(.*?)\\\]/gs, (_, equation) => `$$${equation}$$`)
    .replace(/\\\((.*?)\\\)/gs, (_, equation) => `$${equation}$`);
};

const MessageDisplay = forwardRef<HTMLDivElement, MessageDisplayProps>(
  ({ message, isLastMessage, onClickDislike, onClickLike }, ref) => {
    const isBot = message.type === "bot" || message.type === "bot-temp";
    const isBotTempMessage = message.type === "bot-temp";
    const showFeedbackActions = isBot && !isBotTempMessage;

    const handleClickLike = () => {
      onClickLike();
    };

    const handleClickDislike = () => {
      onClickDislike();
    };

    return (
      <Flex
        flexDir="column"
        gap="0.5rem"
        ref={ref}
        fontSize="13px"
        p="0.75rem 1rem"
        bgColor={isBot ? "gray.200" : "inherit"}
      >
        <Flex alignItems="flex-start" gap="1rem" position="relative">
          {showFeedbackActions && (
            <FeedbackActions
              onClickDislike={handleClickDislike}
              onClickLike={handleClickLike}
              feedbackActionValue={message.feedback?.action}
            />
          )}
          <Box
            p="0.5rem"
            bg={isBot ? "gray.400" : "gray.100"}
            borderRadius="lg"
          >
            {isBot ? <BsRobot size="1.5rem" /> : <BsPerson size="1.5rem" />}
          </Box>
          {isBotTempMessage ? (
            <Flex alignItems="center" h="100%">
              <Spinner />
            </Flex>
          ) : (
            // <Flex justifyContent="center" h="100%" flexDir="column" pl="1rem">
            <div className="markdown prose w-full md:max-w-full break-words dark:prose-invert dark share-gpt-message">
              <ReactMarkdown
                remarkPlugins={[
                  remarkGfm,
                  [remarkMath, { singleDollarTextMath: false }],
                ]}
                rehypePlugins={[
                  rehypeKatex,
                  [
                    rehypeHighlight,
                    {
                      detect: true,
                      ignoreMissing: true,
                      subset: codeLanguageSubset,
                    },
                  ],
                ]}
                linkTarget="_new"
                components={{
                  code,
                  p,
                }}
              >
                {preprocessLaTeX(message.text)}
              </ReactMarkdown>
            </div>
            // </Flex>
          )}
        </Flex>
        {!!message.sourceDocs && (
          <Accordion px="4rem">
            {message.sourceDocs.map((doc, idx) => {
              return (
                <AccordionItem key={doc.pageContent}>
                  <h2>
                    <AccordionButton>
                      <Box as="span" flex="1" textAlign="left" fontSize="13px">
                        Source {idx}
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {doc.pageContent}
                    </ReactMarkdown>
                    <Text
                      fontSize="0.875rem"
                      fontWeight="500"
                      bgColor="gray.300"
                      w="fit-content"
                      px="1rem"
                      borderRadius="lg"
                    >
                      Source: {doc.metadata.source.split("/").pop()}
                    </Text>
                  </AccordionPanel>
                </AccordionItem>
              );
            })}
          </Accordion>
        )}
      </Flex>
    );
  }
);
MessageDisplay.displayName = "MessageDisplay";

const code = memo((props: CodeProps) => {
  const { inline, className, children } = props;
  const match = /language-(\w+)/.exec(className || "");
  const lang = match && match[1];

  if (inline) {
    return <code className={className}>{children}</code>;
  } else {
    return <CodeBlock lang={lang || "text"} codeChildren={children} />;
  }
});
code.displayName = "code";

const p = memo(
  (
    props?: Omit<
      DetailedHTMLProps<
        HTMLAttributes<HTMLParagraphElement>,
        HTMLParagraphElement
      >,
      "ref"
    > &
      ReactMarkdownProps
  ) => {
    return <p className="whitespace-pre-wrap">{props?.children}</p>;
  }
);
p.displayName = "p";

export default MessageDisplay;
