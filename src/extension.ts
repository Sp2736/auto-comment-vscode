/**
 * @file extension.ts
 * @description Core entry point for the Logic Commenter VS Code Extension.
 * This module handles the registration of commands, text extraction,
 * and integration with the Google Gemini API to generate logic-based comments.
 */

import * as vscode from "vscode";
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";
import * as path from "path";

// Load environment variables from the .env file located in the project root.
dotenv.config({ path: path.join(__dirname, "..", ".env") });

/**
 * Defines the comment syntax structures for supported programming languages.
 */
const commentSyntaxRules: Record<string, { start: string; end: string }> = {
  javascript: { start: "/**", end: " */" },
  typescript: { start: "/**", end: " */" },
  python: { start: '"""', end: '"""' },
  java: { start: "/*", end: " */" },
  cpp: { start: "/*", end: " */" },
  csharp: { start: "/*", end: " */" },
  php: { start: "/*", end: " */" },
  default: { start: "/*", end: " */" },
};

/**
 * Activates the extension.
 * @param {vscode.ExtensionContext} context - The context in which the extension is running.
 */
export function activate(context: vscode.ExtensionContext): void {
  const disposable = vscode.commands.registerCommand(
    "logic-commenter.addComment",
    async () => {
      const editor = vscode.window.activeTextEditor;

      if (!editor) {
        vscode.window.showInformationMessage("No active text editor found.");
        return;
      }

      const selection = editor.selection;
      const selectedText = editor.document.getText(selection);

      if (!selectedText || selectedText.trim().length === 0) {
        vscode.window.showWarningMessage(
          "Please select a valid code snippet to generate comments."
        );
        return;
      }

      // Try to get the key from the OS secure storage (BYOK)
      let apiKey = await context.secrets.get("gemini_api_key");

      // Fallback to .env (Only works on personal dev PC)
      if (!apiKey && process.env.GEMINI_API_KEY) {
        apiKey = process.env.GEMINI_API_KEY;
      }

      // If NO key is found, ask the user to provide one securely
      if (!apiKey) {
        apiKey = await vscode.window.showInputBox({
          prompt: "Paste your Gemini API Key from Google AI Studio",
          ignoreFocusOut: true,
          password: true, // Hides the key as they type
        });

        if (apiKey) {
          // Save it securely in the OS Keychain so they only do this once
          await context.secrets.store("gemini_api_key", apiKey);
          vscode.window.showInformationMessage("API Key saved securely!");
        } else {
          vscode.window.showErrorMessage(
            "Logic Commenter requires a Gemini API Key to function."
          );
          return; // Stop execution if they cancel the prompt
        }
      }
      // ----------------------------------

      // Initialize the Generative AI client
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        generationConfig: {
          maxOutputTokens: 350, // Had to increase token limit due to high-process thinking
          temperature: 0.4, // Decent creativity update
        },
      });

      await vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          title: "Analyzing code logic...",
          cancellable: false,
        },
        async () => {
          try {
            // Construct a strict prompt to ensure precise output
            const prompt = `Analyze the following code snippet and provide a 2 line context comment to add to describe the code snippet, explaining its core logic. Do not include markdown, code blocks, or introductory text. Keep the tone formal, and documentation-ready for the comments.\n\nCode:\n${selectedText}`;

            const result = await model.generateContent(prompt);
            // console.log("RAW AI RESPONSE:", JSON.stringify(result));
            const response = await result.response;
            
            let generatedText = "";
            try {
                 generatedText = response.text().trim();
            } catch (textError) {
                 console.log("Text parsing failed. Likely blocked by safety filters.");
            }

            if (!generatedText) {
              throw new Error("Received empty response from the AI model.");
            }

            insertComment(editor, selection, generatedText);
          } catch (error) {
            console.error("Logic Commenter API Error:", error);
            
            // If the key is invalid, delete it so the user is prompted again next time
            await context.secrets.delete("gemini_api_key");
            
            vscode.window.showErrorMessage(
              "Failed to generate comment. Please verify your API key and network connection."
            );
          }
        }
      );
    }
  );

  context.subscriptions.push(disposable);
}

/**
 * Formats and inserts the generated comment into the active text editor.
 * @param {vscode.TextEditor} editor - The currently active text editor.
 * @param {vscode.Selection} selection - The user's current text selection.
 * @param {string} commentText - The AI-generated explanation.
 */
function insertComment(
  editor: vscode.TextEditor,
  selection: vscode.Selection,
  commentText: string
): void {
  const languageId = editor.document.languageId;
  const syntax = commentSyntaxRules[languageId] || commentSyntaxRules.default;

  // Construct the multiline comment block
  const commentBlock = `${syntax.start}\n ${commentText}\n${syntax.end}\n`;

  editor.edit((editBuilder) => {
    editBuilder.insert(selection.start, commentBlock);
  });
}

/**
 * Deactivates the extension.
 * Used for cleanup operations if necessary.
 */
export function deactivate(): void {
  // No specific cleanup required currently
}