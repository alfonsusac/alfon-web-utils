import type { NextApiRequest, NextApiResponse } from "next";
import { tiktokenEncodings, tiktokenModels } from "./tiktoken/tokenize";

export default function handler(req: NextApiRequest, res: NextApiResponse) {

  if (req.method === 'GET') {
    res.status(200).send(`
Welcome to the tiktoken API hosted by alfon.dev!

List of APIs:

  ## Tokenize:
  - GET /api/tiktoken/tokenize
  - POST /api/tiktoken/tokenize

  Request body:
  - content: string
  - encoding: string (optional)
  - model: string (optional)

  Response:
  - tokens:
    | { tokens: number[], remaining: number } 
    | { error: string }
    | { error: string, remaining: number, reset: number }

  ## Tokenize All:
  - GET /api/tiktoken/tokenize-all
  - POST /api/tiktoken/tokenize-all

  Request body:
  - content: string

  Response:
  - data: 
    | { data: {
        [encoding: string]: 
          | { token: number[] }
          | { error: string }
      }, remaining: number }
    | { error: string } 
    | { error: string, remaining: number, reset: number }


  Valid Encodings:
${tiktokenEncodings.map((encoding) => `  - ${encoding}`).join('\n')}
  
  Valid Models:
${tiktokenModels.map((encoding) => `  - ${encoding}`).join('\n')}

`.trim()
    );
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }

}