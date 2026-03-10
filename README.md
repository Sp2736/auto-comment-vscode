# Logic Commenter by SP

**An AI-driven VS Code extension for automated logic-based code documentation.**

Logic Commenter seamlessly integrates Google Gemini 2.5 Flash into your development environment to analyze complex code snippets and generate precise, language-aware multiline documentation comments. It minimizes the manual overhead of writing structural documentation, allowing developers to focus on architecture and logic.

## 📺 Demonstration
![Logic Commenter Demo](https://github.com/user-attachments/assets/e2918c13-5ac7-439c-a7e0-406114a49a10)
> *Select a code snippet, invoke the context menu, and generate documentation instantly.*

---

## ✨ Key Features
* **Contextual Logic Analysis:** Utilizes state-of-the-art Generative AI to interpret the *intent* and *mechanics* of your code, producing meaningful summaries rather than redundant syntax descriptions.
* **Language-Agnostic Formatting:** Automatically detects the active `languageId` (e.g., JavaScript, Python, C++, Java) and wraps the AI response in the appropriate multiline comment syntax.
* **Optimized Latency:** Configured with strict token limits and low temperature settings to ensure near-instantaneous API responses.
* **Zero-Telemetry Architecture:** Your code remains private. Only explicitly selected snippets are transmitted to the API for the sole purpose of generating the comment.

---

## 🚀 Installation & Setup (BYOK Architecture)

To ensure this extension remains entirely free and unrestricted for all users, Logic Commenter operates on a **Bring Your Own Key (BYOK)** model. 

### Prerequisites
1. Acquire a free API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

### Initialization
1. Install **Logic Commenter** from the VS Code Extensions Marketplace.
2. Open any source file and highlight a function or code block.
3. Right-click the selection and execute **Add Logic Comment**.
4. Upon first execution, a secure prompt will request your Gemini API Key. 
5. Paste your key. It will be securely encrypted and stored in your operating system's native keychain via VS Code's `SecretStorage` API. You will not need to enter it again.

---

## 🛠 Usage Guide
1. **Select:** Highlight the specific block of logic you wish to document. For optimal results, select complete functional blocks (e.g., 10–50 lines).
2. **Execute:** Right-click the selection and choose **Add Logic Comment** from the context menu (or use the Command Palette via `Ctrl+Shift+P`).
3. **Review:** The generated multiline comment will be automatically injected directly above your selection, matching the indentation of your code.

---

## 🔒 Security & Data Integrity
* **Credential Management:** API keys are never stored in plaintext. They are managed exclusively through the VS Code Extension API's secure storage mechanisms.
* **Network Protocol:** All API requests are routed directly from your local machine to Google's endpoints via secure HTTPS. No intermediary proxy servers are used, ensuring zero middleman data retention.

---

## 👨‍💻 About the Author

**Swayam Patel (SP)**
* **GitHub:** [@Sp2736](https://github.com/Sp2736)

Explore my other visual and productivity tools for VS Code:
* 🌑 [**Dark Angel**](https://marketplace.visualstudio.com/items?itemName=sp2736.dark-angel-by-sp): A deep, aesthetic dark theme optimized for night-owls and prolonged coding sessions.
* ☀️ [**White Devil**](https://marketplace.visualstudio.com/items?itemName=sp2736.white-devil-by-sp): A crisp, modern light theme built for daylight clarity and minimalism.

---
