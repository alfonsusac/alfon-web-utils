// import wasm from "tiktoken/lite/tiktoken_bg.wasm?module";
// import model from "tiktoken/encoders/cl100k_base.json";
// import { init, Tiktoken } from "tiktoken/lite/init";

import { get_encoding } from "tiktoken";

// import type { Tiktoken, TiktokenBPE } from "tiktoken"

// export const config = { runtime: "edge" };

// import { init } from "tiktoken/init";
// import { get_encoding } from "tiktoken/tiktoken_bg.wasm";

export async function getStringContextLength(
  // str: string,
  // model: TiktokenModel = "gpt-4o"
) {
  const encoding = get_encoding("cl100k_base");
  const tokens = encoding.encode("hello world");
  encoding.free();
  return tokens.length
  //---
  // try {
  //   const { get_encoding } = await import("tiktoken");
  //   const encoding = get_encoding("cl100k_base");
  //   const tokens = encoding.encode(str);
  //   encoding.free();
  //   return tokens.length
  // } catch (error) {
  //   throw error
  // }
  // await init((imports) => WebAssembly.instantiate(wasm, imports));

  // const encoding = new Tiktoken(
  //   model.bpe_ranks,
  //   model.special_tokens,
  //   model.pat_str
  // );

  //   const tokens = encoding.encode(str);
  //   encoding.free();
  //   return tokens.length

}