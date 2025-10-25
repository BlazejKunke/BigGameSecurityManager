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

    // Map the total skill score to a base salary range where low skill sets start near
    // the minimum salary and exceptionally skilled applicants approach the top end.
    const MIN_SKILL_SUM = 17;
    const MAX_SKILL_SUM = 43;
    const MIN_BASE_SALARY = 140;
    const MAX_BASE_SALARY = 600;

    const normalizedSkill = Math.min(1, Math.max(0, (skillSum - MIN_SKILL_SUM) / (MAX_SKILL_SUM - MIN_SKILL_SUM)));
    const skillBasedSalary = MIN_BASE_SALARY + normalizedSkill * (MAX_BASE_SALARY - MIN_BASE_SALARY);

    // Introduce personality-driven negotiation styles. Most candidates negotiate near
    // their skill-based value, while a minority are noticeably humble or aggressive.
    const personalityRoll = Math.random();
    let personalityFactor: number;

    if (personalityRoll < 0.15) {
        // Humbler applicants ask for a bit less than their skills might warrant.
        personalityFactor = 0.7 + Math.random() * 0.15; // 0.70 - 0.85
    } else if (personalityRoll < 0.85) {
        // Typical applicants cluster around the skill-based expectation.
        const bellCurve = (Math.random() + Math.random()) / 2; // Peak at 0.5
        personalityFactor = 0.9 + bellCurve * 0.3; // ~0.9 - 1.2, centered near 1.05
    } else {
        // More aggressive negotiators push for noticeably higher salaries.
        personalityFactor = 1.15 + Math.random() * 0.25; // 1.15 - 1.40
    }

    let salary = skillBasedSalary * personalityFactor;

    // Clamp the salary to the desired $100-$750 range.
    salary = Math.max(100, Math.min(750, salary));

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