// pages/api/chat.js

import schedulesData from '../../data/schedules.json';
import stringSimilarity from 'string-similarity';
import { generateCodePromptv2 } from '../../src/app/lib/openaiv2';

const intents = {
  dayQuery: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
};

var generatedCode = "";


//We have to modify this prompt for AI for requesting the data based on logic.
const prompt = process.env.CURATED_PRIVATE_PROMPT;

let getCode = async (inMsg) => {
  try {
    generatedCode = await generateCodePromptv2(inMsg);
    console.log('Generated Code:', generatedCode);
    // return JSON.stringify(generatedCode).replace(/\n/g, " ");
  } catch (error) {
    console.error('Error:', error);
  }
};



function getIntent(userMessage) {
  let highestMatchRating = 0;
  let matchedIntent = "";

  userMessage = userMessage.replace(/[^a-zA-Z0-9]/g, ' ');

  const stringArray = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
  const inputString = userMessage;
  let presentString = "";
  let isStringPresent = false;

  for (const string of stringArray) {
    if (inputString.includes(string)) {
      isStringPresent = true;
      presentString = string;
      break;
    }
  }

  console.log('CHAT FILE: intent msg is:' + presentString);

  Object.entries(intents).forEach(([_, phrases]) => {
    const { bestMatch } = stringSimilarity.findBestMatch(presentString.toLowerCase(), phrases);
    if (bestMatch.rating > highestMatchRating && bestMatch.rating > 0.4) {
      highestMatchRating = bestMatch.rating;
      matchedIntent = bestMatch.target;
    }
  });

  return matchedIntent;
}

function parseCountQuery(message) {

  message = message.replace(/\n/g, ' ');
  console.log('CHAT FILE: count query pre - msg is:' + message);

  message = message.replace(/[^a-zA-Z0-9]/g, " ").toLowerCase();

  console.log('CHAT FILE: count query msg is:' + message);

  const patterns = {
    department: /department (\w+)/i,
    course: /course (\w+ \d+)/i,
    className: /class (.+)/i,
    professor: /professor (.+)/i,
  };
  const result = {};

  Object.keys(patterns).forEach(key => {
    const match = message.match(patterns[key]);
    if (match) {
      result.type = key;
      result.value = match[1];
    }
  });

  return result;
}

export default async function handler(req, res) {
  const { message } = req.body;

  console.log('CHAT FILE: user msg is:' + message);

  console.log("CHAT-API: Called");
  const inputMessage = prompt + message;
  try {
    console.log("CHAT-API: AI call to get the code.");
    await getCode(inputMessage);
    // console.log("CHAT-API: AI output." + aiOutput);
    console.log('CHAT-API: Generated Code:', generatedCode);
    // let aiOutput = generatedCode;
    // return res.status(200).json(aiOutput);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error handling the request' });
  }

  //

  generatedCode = generatedCode.replace(/[^a-zA-Z0-9]/g, " ").toLowerCase();
  console.log("CHAT-API: New generated code is." + generatedCode);


  const intent = getIntent(generatedCode);
  console.log("CHAT-API: Intent is." + intent);

  const countQuery = parseCountQuery(generatedCode);
  console.log("CHAT-API: countQuery is." + JSON.stringify(countQuery));

  let dbVal;
  let dbValArray;
  try {
    if (intent) {
      const foundSchedules = schedulesData.filter(schedule => schedule.day.toLowerCase() === intent.toLowerCase());
      if (foundSchedules.length > 0) {
        const scheduleMessages = foundSchedules.map(schedule =>
          `${schedule.className} in ${schedule.buildingName} room ${schedule.roomNumber}, from ${schedule.startTime} to ${schedule.endTime}, taught by Professor ${schedule.professor}.`
        ).join('\n');

        return res.status(200).json({ message: `Schedules for ${intent}:\n${scheduleMessages}` });
      } else {
        return res.status(200).json({ message: `No schedules found for ${intent}.` });
      }
    } else if (countQuery.type) {
      const { type, value } = countQuery;
      // let dbVal;
      const results = schedulesData.filter(schedule => {
        switch (type) {
          case 'department':
            // return schedule.department.toUpperCase() === value.toUpperCase();
            dbVal = schedule.department.toLowerCase();
            if (value.includes(dbVal) || dbVal.includes(value.toLowerCase())) {
              console.log("dbval is" + dbVal);
              dbValArray = dbVal;
            }
            return value.includes(dbVal) || dbVal.includes(value.toLowerCase());
          case 'course':
            dbVal = `${schedule.department.toUpperCase()} ${schedule.course}`;
            if (dbVal.includes(value.toUpperCase()) || value.toUpperCase().includes(dbVal)) {
              console.log("dbval is" + dbVal);
              dbValArray = dbVal;
            }
            return dbVal.includes(value.toUpperCase()) || value.toUpperCase().includes(dbVal);
          case 'className':
            // return schedule.className.toLowerCase().includes(value.toLowerCase());
            dbVal = schedule.className.toLowerCase();

            if (value.includes(dbVal) || dbVal.includes(value.toLowerCase())) {
              console.log("dbval is" + dbVal);
              dbValArray = dbVal;
            }

            return value.includes(dbVal) || dbVal.includes(value.toLowerCase());
          case 'professor':
            dbVal = schedule.professor.toLowerCase();
            if (value.includes(dbVal) || dbVal.includes(value.toLowerCase())) {
              console.log("dbval is" + dbVal);
              dbValArray = dbVal;
            }

            return value.includes(dbVal) || dbVal.includes(value.toLowerCase());
          // return schedule.professor.toLowerCase().includes(value.toLowerCase());
          default:
            return false;
        }
      });

      if (results.length > 0) {
        return res.status(200).json({
          message: `Found ${results.length} ${type}(s) for ${dbValArray}.`,
          details: results.map(r => `${r.className} by Professor ${r.professor} in ${r.roomNumber} at ${r.startTime}`).join('\n')
        });
      } else {
        return res.status(200).json({ message: `No matching ${type}(s) found for ${dbValArray}.` });
      }
    } else {
      return res.status(200).json({ message: "Please specify a valid query about days, class information, or professor name." });
    }
  } catch (error) {
    console.error("Error handling the request:", error);
    return res.status(500).json({ message: 'Error handling the request' });
  }
}
