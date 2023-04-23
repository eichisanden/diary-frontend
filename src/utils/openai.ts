import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: import.meta.env.VITE_OPEN_API_TOKEN,
});
const openai = new OpenAIApi(configuration);

export default openai;
