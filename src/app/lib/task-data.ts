import type { Task } from '@/shared/types';

export const TASK_TEXT_MAX_LENGTH = 160;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export const normalizeTaskText = (value: string): string => {
  const normalizedText = value.trim();

  if (!normalizedText) throw new Error('Görev metni boş bırakılamaz.');
  if (normalizedText.length > TASK_TEXT_MAX_LENGTH) {
    throw new Error(`Görev metni en fazla ${TASK_TEXT_MAX_LENGTH} karakter olabilir.`);
  }

  return normalizedText;
};

export const parseTaskCollection = (data: unknown): Task[] => {
  if (data === null) return [];
  if (!isRecord(data)) throw new Error('Sunucudan geçersiz görev verisi alındı.');

  return Object.entries(data).flatMap(([id, value]) => {
    if (!isRecord(value) || typeof value.text !== 'string') return [];

    let text: string;
    try {
      text = normalizeTaskText(value.text);
    } catch {
      return [];
    }

    return [{
      id,
      text,
      // Eski kayıtlarda alan bulunmadığında görev tamamlanmamış kabul edilir.
      completed: value.completed === true,
    }];
  });
};

export const parseCreatedTaskId = (data: unknown): string => {
  if (!isRecord(data) || typeof data.name !== 'string' || !data.name) {
    throw new Error('Oluşturulan görev için geçerli bir kimlik alınamadı.');
  }

  return data.name;
};
