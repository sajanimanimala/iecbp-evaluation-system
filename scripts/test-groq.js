import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

async function main() {
    const response = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [
            {
                role: "user",
                content: "Say hello in one sentence"
            }
        ]
    });

    console.log(response.choices[0].message.content);
}

main();