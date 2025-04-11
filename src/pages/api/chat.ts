import type { NextApiRequest, NextApiResponse } from "next";
import type { PineconeMetadata } from "@/types/pinecone";
import { pinecone } from "@/utils/pinecone";
import { PINECONE_INDEX_NAME } from "@/config/be/pinecone";
import { IHistory } from "@/types/chat";
import { encode } from "gpt-3-encoder";
import { Configuration, OpenAIApi } from "openai";
import { QueryOptions } from "@pinecone-database/pinecone";
import QUESTION_PROMPT from "@/utils/prompt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { question, history, amendment, customResponse } = req.body as {
    question: string;
    history: IHistory;
    amendment: string | undefined;
    customResponse: any;
  };

  const historyFormatted = history
    .map((m) => [
      { role: "user" as const, content: m[0] },
      { role: "assistant" as const, content: m[1] },
    ])
    .flat();

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  if (!question) {
    return res.status(400).json({ message: "No question in the request" });
  }

  // OpenAI recommends replacing newlines with spaces for best results
  const sanitizedQuestion = (
    question +
    ". Answer in a clear, consistent style, with precise and accurate responses."
  )
    .trim()
    .replaceAll("\n", " ");

  try {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    const embeddingResponse = await openai.createEmbedding({
      model: "text-embedding-ada-002",
      input: sanitizedQuestion,
    });

    const [{ embedding }] = embeddingResponse.data.data;

    const queryRequest: QueryOptions = {
      vector: embedding,
      topK: 10,
      includeValues: true,
      includeMetadata: true,
    };

    const [namespaceDefault, namespace69a] = await Promise.all([
      fetchContext(PINECONE_INDEX_NAME, queryRequest),
      fetchContext(PINECONE_INDEX_NAME, queryRequest, "69a"),
    ]);
    const globalContents = [...namespaceDefault, ...namespace69a];

    let amendmentContents: Array<PineconeMetadata> = [];
    if (amendment) {
      amendmentContents = await fetchContext(amendment, queryRequest);
    }

    // Include customResponse in the prompt if available
    const prompt = QUESTION_PROMPT(
      amendmentContents,
      globalContents,
      amendment,
      customResponse
    );

    const openAiApiRes = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        { role: "system", content: prompt },
        ...historyFormatted,
        { role: "user", content: sanitizedQuestion },
      ],
      temperature: 0.1,
      max_tokens: 3000,
      top_p: 0.9,
      frequency_penalty: 0.2,
      presence_penalty: 0,
    });
    const textResponse = openAiApiRes.data.choices[0].message?.content;
    res.status(200).json({
      text: textResponse,
      questionTokens: encode(sanitizedQuestion).length,
      answerTokens: encode(textResponse ?? "").length,
    });
  } catch (error: any) {
    console.error({ error });
    res.status(500).json({ error: error.message || "Something went wrong" });
  }
}

async function fetchContext(
  indexName: string,
  queryRequest: QueryOptions,
  namespace?: string
): Promise<
  Array<{
    text: string;
    page_number: number;
  }>
> {
  const index = pinecone.Index(indexName);
  const queryResponse = await (namespace
    ? index.namespace(namespace).query(queryRequest)
    : index.query(queryRequest));
  const { matches } = queryResponse;
  const contents = matches.map(
    (m) => m.metadata as unknown as PineconeMetadata
  );
  return contents;
}
