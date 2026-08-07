import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  normalizeTaskText,
  parseCreatedTaskId,
  parseTaskCollection,
  TASK_TEXT_MAX_LENGTH,
} from './task-data.ts';

describe('normalizeTaskText', () => {
  it('baş ve sondaki boşlukları temizler', () => {
    assert.equal(normalizeTaskText('  Görevi tamamla  '), 'Görevi tamamla');
  });

  it('boş metni reddeder', () => {
    assert.throws(() => normalizeTaskText('   '), /boş bırakılamaz/);
  });

  it('karakter sınırını aşan metni reddeder', () => {
    assert.throws(
      () => normalizeTaskText('a'.repeat(TASK_TEXT_MAX_LENGTH + 1)),
      /en fazla 160 karakter/,
    );
  });
});

describe('parseTaskCollection', () => {
  it('boş Firebase yanıtını boş listeye dönüştürür', () => {
    assert.deepEqual(parseTaskCollection(null), []);
  });

  it('geçerli görevleri dönüştürür ve eski kayıtları destekler', () => {
    assert.deepEqual(
      parseTaskCollection({
        first: { text: 'Raporu tamamla', completed: true },
        second: { text: 'Toplantıya katıl' },
      }),
      [
        { id: 'first', text: 'Raporu tamamla', completed: true },
        { id: 'second', text: 'Toplantıya katıl', completed: false },
      ],
    );
  });

  it('bozuk görev kayıtlarını yok sayar', () => {
    assert.deepEqual(
      parseTaskCollection({
        valid: { text: 'Geçerli' },
        invalid: { text: 42 },
        empty: { text: '   ' },
      }),
      [{ id: 'valid', text: 'Geçerli', completed: false }],
    );
  });

  it('koleksiyon olmayan yanıtı reddeder', () => {
    assert.throws(() => parseTaskCollection([]), /geçersiz görev verisi/);
  });
});

describe('parseCreatedTaskId', () => {
  it('Firebase tarafından üretilen kimliği döndürür', () => {
    assert.equal(parseCreatedTaskId({ name: 'task-123' }), 'task-123');
  });

  it('geçersiz kimliği reddeder', () => {
    assert.throws(() => parseCreatedTaskId({ name: '' }), /geçerli bir kimlik/);
  });
});
