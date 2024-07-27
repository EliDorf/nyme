const Groq = require('groq-sdk');

const groq = new Groq();
async function main() {
  const chatCompletion = await groq.chat.completions.create({
    "messages": [
      {
        "role": "system",
        "content": "A naming bot"
      },
      {
        "role": "user",
        "content": "create variations of the given name like\n\nInput: apple Output: appy, apples, appen, plen, ppen\n\nanother example, input:bask output: basky, basken, Aske, sken, bast"
      }
    ],
    "model": "llama3-8b-8192",
    "temperature": 1,
    "max_tokens": 1024,
    "top_p": 1,
    "stream": true,
    "stop": null
  });

  for await (const chunk of chatCompletion) {
    process.stdout.write(chunk.choices[0]?.delta?.content || '');
  }
}

main();