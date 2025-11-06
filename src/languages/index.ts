import * as vscode from "vscode";
import { OFXTagDescriptions, SupportedLanguage } from "../types/tags";
import en from "./en";
import ptBr from "./pt-br";

export interface LanguageRegistry {
  ofxTags: OFXTagDescriptions;
}

/**
 * Language registry mapping language codes to their descriptions
 */
const languages: Record<SupportedLanguage, LanguageRegistry> = {
  en: en,
  "pt-br": ptBr,
};

/**
 * Gets the appropriate language descriptions based on VS Code's locale setting
 * Falls back to English if the locale is not supported
 */
export function getLanguageDescriptions(): LanguageRegistry {
  const locale = vscode.env.language.toLowerCase();

  // Direct match
  if (locale in languages) {
    return languages[locale as SupportedLanguage];
  }

  // Try to match language code (e.g., 'pt' from 'pt-BR')
  const languageCode = locale.split("-")[0];

  // Special handling for Portuguese
  if (languageCode === "pt") {
    return languages["pt-br"];
  }

  // Default to English
  return languages["en"];
}

/**
 * Gets the description for a specific OFX tag
 * @param tag The OFX tag name
 * @returns The description in the current language, or undefined if not found
 */
export function getTagDescription(tag: string): string | undefined {
  const descriptions = getLanguageDescriptions().ofxTags;
  return descriptions[tag as keyof OFXTagDescriptions];
}

export const currencyLocales = {
  USD: {
    locale: "en-US",
    currency: "USD",
  },
  BRL: {
    locale: "pt-BR",
    currency: "BRL",
  },
};
