import { ChatOpenAI } from "langchain/chat_models/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { ConversationalRetrievalQAChain } from "langchain/chains";

const CONDENSE_PROMPT = `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.

Chat History:
{chat_history}
Follow Up Input: {question}
Standalone question:`;

const QA_PROMPT = `You are a helpful AI assistant. 
Use the following pieces of context to answer the question at the end.
If the question is not related to the context, try to find the most suitable answer that you know about.
If you don't know the answer, just say you don't know. DO NOT try to make up an answer.
Also note to answer in markdown format.

{context}

Question: {question}
Helpful answer in markdown:`;

export const makeChain = (vectorstore: PineconeStore) => {
  const model = new ChatOpenAI({
    temperature: 0.2, // increase temepreature to get more creative answers
    modelName: "gpt-3.5-turbo", //change this to gpt-4 once having access
    presencePenalty: 0,
    topP: 1,
    frequencyPenalty: 0,
  });

  const documentsChain = ConversationalRetrievalQAChain.fromLLM(
    model,
    vectorstore.asRetriever(),
    {
      qaTemplate: QA_PROMPT,
      questionGeneratorTemplate: CONDENSE_PROMPT,
    }
  );
  return documentsChain;
};
