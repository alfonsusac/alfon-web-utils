import { get_encoding } from "tiktoken";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const encoding = get_encoding("cl100k_base");
  const tokens = encoding.encode("hello world");
  encoding.free();
  return res.status(200).json({ tokens });
}