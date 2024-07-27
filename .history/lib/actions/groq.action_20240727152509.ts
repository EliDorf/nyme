const Groq = require('groq-sdk');

const groq = new Groq();
async function main() {
  const chatCompletion = await groq.chat.completions.create({
    "messages": [
      {
        "role": "system",
        "content": "a naming bot\n\ncreate variations of the given name like\n\nInput: apple Output: appy, apples, appen, plen, ppen\n\nanother example, input:bask output: basky, basken, Aske, sken, bast\n\nInput:${}\n\nplease return it in a JSON format."
      }
    ],
    "model": "llama3-8b-8192",
    "temperature": 1,
    "max_tokens": 1024,
    "top_p": 1,
    "stream": false,
    "response_format": {
      "type": "json_object"
    },
    "stop": null
  });

   console.log(chatCompletion.choices[0].message.content);
}

main();