-- Migration: Add Language Support to Vocabulary System
-- Date: 2025-10-16
-- Description: Add language field and language-specific metadata to support multi-language vocabulary

-- Add language code field to VocabularyWord
ALTER TABLE "VocabularyWord"
  ADD COLUMN "language" VARCHAR(2) NOT NULL DEFAULT 'de',
  ADD COLUMN "languageSpecificData" JSONB DEFAULT '{}';

-- Add index on language field for performance
CREATE INDEX "idx_vocabulary_word_language" ON "VocabularyWord"("language");

-- Create GIN index for language-specific data JSONB queries
CREATE INDEX "idx_vocabulary_word_language_data" ON "VocabularyWord" USING GIN ("languageSpecificData");

-- Update existing records to explicitly set language as German
UPDATE "VocabularyWord" SET "language" = 'de' WHERE "language" IS NULL OR "language" = 'de';

-- Add helpful comments
COMMENT ON COLUMN "VocabularyWord"."language" IS 'ISO 639-1 language code (de, en, es, fr, it, etc.)';
COMMENT ON COLUMN "VocabularyWord"."languageSpecificData" IS 'Language-specific metadata including grammar rules, pronunciation hints, common mistakes, and regional variations';

-- Add example language-specific data structure (for documentation):
-- {
--   "gender": "masculine" | "feminine" | "neuter",
--   "article": "der" | "die" | "das",
--   "plural": "Häuser",
--   "commonMistakes": [
--     {"mistake": "Maus", "mistakeType": "PHONETIC_CONFUSION", "frequency": 8}
--   ],
--   "compoundParts": ["Haus", "Tür"],
--   "regionalVariations": [
--     {"region": "Austria", "variation": "Häusl"}
--   ],
--   "pronunciationHints": ["stress on first syllable", "long 'a' sound"]
-- }

-- Migration is backward compatible:
-- - Existing records get default language 'de'
-- - languageSpecificData defaults to empty object
-- - No breaking changes to existing queries
