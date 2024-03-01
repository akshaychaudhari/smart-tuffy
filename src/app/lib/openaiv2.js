import OpenAI from "openai";

const openai = new OpenAI();

export async function generateCodePromptv2(prompt) {
  try {
    console.log('OPENAI: generating the code from Open AI v2');
    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: prompt }],
      model: "gpt-3.5-turbo",
    });
    console.log('OPENAI: Resp Message:' + JSON.stringify(completion.choices[0].message.content));
    return JSON.stringify(completion.choices[0].message.content);
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw error;
  }
}
