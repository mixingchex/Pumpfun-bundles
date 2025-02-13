import { Keypair } from '@solana/web3.js';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

export const retrieveEnvVariable = (variableName: string) => {
  const variable = process.env[variableName] || '';
  if (!variable) {
    console.log(`${variableName} is not set`);
    process.exit(1);
  }
  return variable;
};

// Define the type for the JSON file content

export const randVal = (min: number, max: number, count: number, total: number, isEven: boolean): number[] => {

}


export const saveDataToFile = (newData: string[], filePath: string = "data.json") => {
  try {
    let existingData: string[] = [];

    // Check if the file exists
    if (fs.existsSync(filePath)) {
      // If the file exists, read its content
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      existingData = JSON.parse(fileContent);
    }

    // Add the new data to the existing array
    existingData.push(...newData);

    // Write the updated data back to the file
    fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2));

  } catch (error) {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`File ${filePath} deleted and create new file.`);
      }
      fs.writeFileSync(filePath, JSON.stringify(newData, null, 2));
      console.log("File is saved successfully.")
    } catch (error) {
      console.log('Error saving data to JSON file:', error);
    }
  }
};

export const sleep = async (ms: number) => {
  await new Promise((resolve) => setTimeout(resolve, ms))
}

// Function to read JSON file
export function readJson(filename: string = "data.json"): string[] {
  if (!fs.existsSync(filename)) {
      // If the file does not exist, create an empty array
      fs.writeFileSync(filename, '[]', 'utf-8');
  }
  const data = fs.readFileSync(filename, 'utf-8');
  return JSON.parse(data) as string[];
}


export function deleteConsoleLines(numLines: number) {
  for (let i = 0; i < numLines; i++) {
    process.stdout.moveCursor(0, -1); // Move cursor up one line
    process.stdout.clearLine(-1);        // Clear the line
  }
}
