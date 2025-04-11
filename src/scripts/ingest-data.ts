// TODO: Migrate the code to match the Pinecone library version update

// import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
// import { OpenAIEmbeddings } from "langchain/embeddings/openai";
// import { PineconeStore } from "langchain/vectorstores/pinecone";
// import { pinecone } from "@/utils/pinecone";
// import { PINECONE_INDEX_NAME, PINECONE_NAME_SPACE } from "@/config/be/pinecone";
// import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
// import { TextLoader } from "langchain/document_loaders/fs/text";
// import { DocxLoader } from "langchain/document_loaders/fs/docx";
// import { PDFLoader } from "langchain/document_loaders/fs/pdf";

// // Name of directory to retrieve your files from
// const filePath = "src/docs";

// export const run = async () => {
//   try {
//     // Load raw docs from all files in the directory
//     console.log("1. Load raw docs from all files in the directory");
//     const directoryLoader = new DirectoryLoader(filePath, {
//       ".txt": (path) => new TextLoader(path),
//       ".docx": (path) => new DocxLoader(path),
//       ".md": (path) => new TextLoader(path),
//       ".pdf": (path) => new PDFLoader(path),
//     });
//     const rawDocs = await directoryLoader.load();

//     // Split text into chunks
//     console.log("2. Split text into chunks");
//     const textSplitter = new RecursiveCharacterTextSplitter({
//       chunkSize: 1000,
//       chunkOverlap: 200,
//     });
//     const docs = await textSplitter.splitDocuments(rawDocs);

//     // Create and store the embeddings in the vectorStore
//     const embeddings = new OpenAIEmbeddings();
//     const index = pinecone.Index(PINECONE_INDEX_NAME);
//     console.log("3. Delete the old embeddings in the vectorStore");
//     await index.delete1({
//       deleteAll: true,
//       namespace: PINECONE_NAME_SPACE,
//     });

//     // Embed the docs
//     console.log("4. Create and store the embeddings in the vectorStore");
//     await PineconeStore.fromDocuments(docs, embeddings, {
//       pineconeIndex: index,
//       namespace: PINECONE_NAME_SPACE,
//       textKey: "text",
//     });
//   } catch (error) {
//     console.error({ error });
//     throw new Error("Failed to ingest your data");
//   }
// };

// (async () => {
//   console.log("Ingestion started!");
//   await run();
//   console.log("Ingestion complete!");
// })();
