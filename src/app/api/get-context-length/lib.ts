import wasm from "tiktoken/lite/tiktoken_bg.wasm?module";
import model from "tiktoken/encoders/cl100k_base.json";
import { init, Tiktoken } from "tiktoken/lite/init";


export async function getStringContextLength(
  str: string,
  // model: TiktokenModel = "gpt-4o"
) {
  await init((imports) => WebAssembly.instantiate(wasm, imports));

  const encoding = new Tiktoken(
    model.bpe_ranks,
    model.special_tokens,
    model.pat_str
  );

  const tokens = encoding.encode(str);
  encoding.free();

  return tokens.length

}