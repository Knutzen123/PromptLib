/**
 * Hilfsfunktionen für die PromptLib Anwendung
 */

import type { PromptItem } from '../types';

/**
 * Generiert eine eindeutige ID
 */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

/**
 * Formatiert ein Datum zur lesbaren Darstellung
 */
export function formatDate(timestamp: number): string {
  return new Intl.DateTimeFormat('de-DE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(timestamp));
}

/**
 * Formatiert ein Datum mit Uhrzeit
 */
export function formatDateTime(timestamp: number): string {
  return new Intl.DateTimeFormat('de-DE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(timestamp));
}

/**
 * Berechnet den Popularitäts-Threshold
 */
export function getPopularThreshold(items: PromptItem[], percentile = 0.3, minThreshold = 2): number {
  if (items.length < 3) return 1;
  
  const counts = items
    .map(item => item.copyCount || 0)
    .filter(c => c > 0)
    .sort((a, b) => b - a);
    
  if (counts.length === 0) return 0;
  
  const index = Math.max(0, Math.floor(counts.length * percentile));
  return Math.max(minThreshold, counts[index] || 1);
}

/**
 * Sanitiert einen String für den Gebrauch als Filename
 */
export function sanitizeFilename(filename: string): string {
  return filename.replace(/[^a-z0-9]/gi, '_').toLowerCase();
}

/**
 * Erstellt einen Blob und lädt ihn als Datei herunter
 */
export function downloadBlob(data: unknown, filename: string, mimeType = 'application/json') {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Kopiert Text in die Zwischenablage
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy:', error);
    return false;
  }
}

/**
 * Debounce-Funktion für Sucheingaben
 */
export function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Prüft ob ein String einem Tag ähnelt (Fuzzy Matching)
 */
export function fuzzyMatch(tag: string, query: string): { score: number; matches: [number, number][] } {
  const tagLower = tag.toLowerCase();
  const queryLower = query.toLowerCase();
  const matches: [number, number][] = [];
  let score = 0;
  
  // Exakte Übereinstimmung
  if (tagLower === queryLower) {
    return { score: 1, matches: [[0, tag.length]] };
  }
  
  // Enthält den Query
  const index = tagLower.indexOf(queryLower);
  if (index !== -1) {
    matches.push([index, index + query.length]);
    score = 0.8;
    return { score, matches };
  }
  
  // Alle Zeichen des Queries sind im Tag enthalten (in Reihenfolge)
  let queryIndex = 0;
  for (let i = 0; i < tagLower.length && queryIndex < queryLower.length; i++) {
    if (tagLower[i] === queryLower[queryIndex]) {
      if (matches.length === 0 || matches[matches.length - 1][1] !== i) {
        matches.push([i, i + 1]);
      } else {
        matches[matches.length - 1][1] = i + 1;
      }
      queryIndex++;
    }
  }
  
  if (queryIndex === queryLower.length) {
    score = 0.5 * (query.length / tag.length);
  }
  
  return { score, matches };
}

/**
 * Gruppiert Items nach einem bestimmten Schlüssel
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((result, item) => {
    const keyValue = String(item[key]);
    if (!result[keyValue]) {
      result[keyValue] = [];
    }
    result[keyValue].push(item);
    return result;
  }, {} as Record<string, T[]>);
}

/**
 * Sortiert ein Array von Tags nach Häufigkeit
 */
export function sortTagsByFrequency(tags: string[]): string[] {
  const tagCounts = tags.reduce((acc, tag) => {
    acc[tag] = (acc[tag] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([tag]) => tag);
}

/**
 * Validiert ein PromptItem Objekt
 */
export function validatePromptItem(item: Partial<PromptItem>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!item.title || item.title.trim().length === 0) {
    errors.push('Titel ist erforderlich');
  }
  
  if (!item.text || item.text.trim().length === 0) {
    errors.push('Prompt-Text ist erforderlich');
  }
  
  if (item.title && item.title.length > 200) {
    errors.push('Titel darf maximal 200 Zeichen lang sein');
  }
  
  if (item.description && item.description.length > 500) {
    errors.push('Beschreibung darf maximal 500 Zeichen lang sein');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}
