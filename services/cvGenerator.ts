import { GoogleGenAI, Type } from "@google/genai";
import { StaffMember } from '../types';

let ai: GoogleGenAI;

if (process.env.API_KEY) {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
} else {
    console.warn("API_KEY environment variable not found. Using mock data.");
}

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function calculateSalary(stats: StaffMember['stats']): number {
    const skillSum = stats.physicalStrength + stats.communication + stats.observation + (stats.reliability / 10) + (stats.focusSustainability / 10);

    // Drastically reduce base salary and skill multiplier to cut average salary.
    const skillBasedSalary = 150 + skillSum * 6;

    // Use a triangular distribution for the personality factor to make extreme
    // arrogance or humility less common than a more "normal" negotiation style.
    // This creates a bell-curve-like effect for salaries.
    const triangularRandom = (Math.random() + Math.random()) / 2; // Peak at 0.5
    
    // This factor will now range from 0.7 to 1.5, with the most common value being 1.1.
    const personalityFactor = 0.7 + triangularRandom * 0.8;

    let salary = skillBasedSalary * personalityFactor;

    // Clamp the salary to the desired $300-$1000 range.
    salary = Math.max(300, Math.min(1000, salary));

    // Round to the nearest $50 for cleaner numbers.
    return Math.round(salary / 50) * 50;
}


function generateMockCv(): StaffMember {
    const firstNames = ["John", "Jane", "Alex", "Emily", "Chris", "Michael", "Sarah", "David", "Laura"];
    const lastNames = ["Smith", "Doe", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller"];
    const gender = Math.random() > 0.5 ? 'Male' : 'Female';
    
    const stats = {
        physicalStrength: getRandomInt(2, 8),
        communication: getRandomInt(2, 8),
        observation: getRandomInt(2, 8),
        reliability: getRandomInt(60, 99),
        focusSustainability: getRandomInt(50, 95),
        quitRisk: getRandomInt(1, 20),
    };

    const salary = calculateSalary(stats);

    return {
        id: `mock-${Date.now()}-${Math.random()}`,
        firstName: firstNames[getRandomInt(0, firstNames.length - 1)],
        lastName: lastNames[getRandomInt(0, lastNames.length - 1)],
        age: getRandomInt(21, 55),
        gender,
        salary,
        stats,
        currentFocus: 100,
    };
}


export async function generateCv(): Promise<StaffMember> {
  if (!ai) {
      return generateMockCv();
  }
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Generate a single CV for a stadium security guard applicant. Provide realistic and varied stats. Gender can be Male, Female, or Other.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            firstName: { type: Type.STRING },
            lastName: { type: Type.STRING },
            age: { type: Type.INTEGER },
            gender: { type: Type.STRING, enum: ['Male', 'Female', 'Other'] },
            physicalStrength: { type: Type.INTEGER, description: "A value between 1 and 10" },
            communication: { type: Type.INTEGER, description: "A value between 1 and 10" },
            observation: { type: Type.INTEGER, description: "A value between 1 and 10" },
            reliability: { type: Type.INTEGER, description: "A percentage between 50 and 100" },
            focusSustainability: { type: Type.INTEGER, description: "A percentage between 40 and 100" },
            quitRisk: { type: Type.INTEGER, description: "A percentage between 1 and 25" },
          },
        },
      },
    });

    const cvData = JSON.parse(response.text);

    const stats = {
        physicalStrength: Math.max(1, Math.min(10, cvData.physicalStrength)),
        communication: Math.max(1, Math.min(10, cvData.communication)),
        observation: Math.max(1, Math.min(10, cvData.observation)),
        reliability: Math.max(50, Math.min(100, cvData.reliability)),
        focusSustainability: Math.max(40, Math.min(100, cvData.focusSustainability)),
        quitRisk: Math.max(1, Math.min(25, cvData.quitRisk)),
    };

    const salary = calculateSalary(stats);

    const validatedData: StaffMember = {
        id: `gen-${Date.now()}-${Math.random()}`,
        firstName: cvData.firstName,
        lastName: cvData.lastName,
        age: Math.max(18, Math.min(65, cvData.age)),
        gender: cvData.gender,
        salary,
        stats,
        currentFocus: 100,
    };

    return validatedData;

  } catch (error) {
    console.error("Error generating CV with Gemini API, falling back to mock data:", error);
    return generateMockCv();
  }
}