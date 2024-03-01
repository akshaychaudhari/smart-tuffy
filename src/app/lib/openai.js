/* WE ARE NOT USING THIS METHOD TO CALL OPEN AI*/

import axios from 'axios';

const apiKey = process.env.OPENAI_API_KEY2;// 'OPENAI_API_KEY'; // Replace with your actual API key
const apiUrl = 'https://api.openai.com/v1/engines/davinci-codex/completions'; // Check OpenAI API documentation for the latest URL

export async function generateCodePrompt(prompt) {
  try {
    console.log('generating the code from Open AI');
    const response = await axios.post(
      apiUrl,
      {
        prompt: prompt,
        max_tokens: 150, // Adjust as needed
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
      }
    );

    return response.data.choices[0].text.trim();
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw error;
  }
}
