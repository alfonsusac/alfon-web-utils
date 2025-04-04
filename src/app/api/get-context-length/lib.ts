
import { get_encoding } from "tiktoken";

export async function getStringContextLength(
  // str: string,
  // model: TiktokenModel = "gpt-4o"
) {
  const encoding = get_encoding("o200k_base");
  const tokens = encoding.encode("hello world");
  encoding.free();
  return tokens.length
}