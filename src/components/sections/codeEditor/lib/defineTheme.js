import { loader } from "@monaco-editor/react";
//import monokai from "../../../../assets/theme/Monokai.json"
const monacoThemes = {
  monokai: "Monokai",
};

const defineTheme = async (theme) => {
  try {
    const [monaco, themeData] = await Promise.all([
      loader.init(),
      import(`../../../../assets/theme/${monacoThemes[theme]}.json`)
    ]);
    monaco.editor.defineTheme(theme, themeData);
  } catch (error) {
    console.error(`Error loading theme ${theme}:`, error);
    throw error; // Optional: rethrow to allow upstream handling
  }
};

export { defineTheme };
