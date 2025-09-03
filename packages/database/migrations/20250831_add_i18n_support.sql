-- Migration: Add i18n support to existing tables
-- Date: 2025-08-31
-- Description: Add multilingual content support using JSONB columns

-- Add translations column to learning_modules
ALTER TABLE "LearningModule" ADD COLUMN "translations" JSONB DEFAULT '{}';

-- Update existing learning modules with current German content
UPDATE "LearningModule" 
SET "translations" = jsonb_build_object(
    'de', jsonb_build_object(
        'name', "name",
        'description', "description"
    )
) WHERE "translations" = '{}';

-- Add translations column to tasks  
ALTER TABLE "Task" ADD COLUMN "translations" JSONB DEFAULT '{}';

-- Update existing tasks with current German content
UPDATE "Task"
SET "translations" = jsonb_build_object(
    'de', jsonb_build_object(
        'instruction', "instruction",
        'vocabulary', "vocabulary"
    )
) WHERE "translations" = '{}';

-- Add translations column to achievements
ALTER TABLE "Achievement" ADD COLUMN "translations" JSONB DEFAULT '{}';

-- Update existing achievements with current German content  
UPDATE "Achievement"
SET "translations" = jsonb_build_object(
    'de', jsonb_build_object(
        'name', "name",
        'description', "description"
    )
) WHERE "translations" = '{}';

-- Add translations column to rewards
ALTER TABLE "Reward" ADD COLUMN "translations" JSONB DEFAULT '{}';

-- Update existing rewards with current German content
UPDATE "Reward" 
SET "translations" = jsonb_build_object(
    'de', jsonb_build_object(
        'name', "name",
        'description', "description"
    )
) WHERE "translations" = '{}';

-- Add locale preferences to users
ALTER TABLE "User" ADD COLUMN "preferred_locale" VARCHAR(5) DEFAULT 'de';

-- Add locale column to organizations for default locale
ALTER TABLE "Organization" ADD COLUMN "default_locale" VARCHAR(5) DEFAULT 'de';

-- Create indexes for better performance on JSON queries
CREATE INDEX "idx_learning_module_translations" ON "LearningModule" USING GIN ("translations");
CREATE INDEX "idx_task_translations" ON "Task" USING GIN ("translations");  
CREATE INDEX "idx_achievement_translations" ON "Achievement" USING GIN ("translations");
CREATE INDEX "idx_reward_translations" ON "Reward" USING GIN ("translations");

-- Create function to get localized content
CREATE OR REPLACE FUNCTION get_localized_content(
    translations JSONB,
    locale VARCHAR(5) DEFAULT 'de',
    fallback_locale VARCHAR(5) DEFAULT 'de',
    field_name VARCHAR(50) DEFAULT 'name'
) RETURNS TEXT AS $$
BEGIN
    -- Try requested locale first
    IF translations ? locale AND (translations->locale) ? field_name THEN
        RETURN translations->locale->>field_name;
    END IF;
    
    -- Try fallback locale
    IF translations ? fallback_locale AND (translations->fallback_locale) ? field_name THEN
        RETURN translations->fallback_locale->>field_name;
    END IF;
    
    -- Return null if no translation found
    RETURN NULL;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Create view for localized learning modules
CREATE OR REPLACE VIEW "LocalizedLearningModule" AS
SELECT 
    id,
    "organizationId",
    "name" as original_name,
    "description" as original_description,
    grade,
    subject,
    difficulty,
    "isActive",
    "createdAt",
    "updatedAt",
    translations,
    get_localized_content(translations, 'de', 'de', 'name') as name_de,
    get_localized_content(translations, 'en', 'de', 'name') as name_en,
    get_localized_content(translations, 'de', 'de', 'description') as description_de,
    get_localized_content(translations, 'en', 'de', 'description') as description_en
FROM "LearningModule";

-- Create view for localized achievements
CREATE OR REPLACE VIEW "LocalizedAchievement" AS  
SELECT
    id,
    "organizationId",
    "name" as original_name,
    "description" as original_description,
    type,
    criteria,
    "pointsValue",
    "badgeIcon",
    "isActive",
    "createdAt", 
    "updatedAt",
    translations,
    get_localized_content(translations, 'de', 'de', 'name') as name_de,
    get_localized_content(translations, 'en', 'de', 'name') as name_en,
    get_localized_content(translations, 'de', 'de', 'description') as description_de,
    get_localized_content(translations, 'en', 'de', 'description') as description_en
FROM "Achievement";

-- Add helpful comments
COMMENT ON COLUMN "LearningModule"."translations" IS 'JSONB object containing translations in format: {"locale": {"field": "value"}}';
COMMENT ON COLUMN "Task"."translations" IS 'JSONB object containing task instruction and vocabulary translations';  
COMMENT ON COLUMN "Achievement"."translations" IS 'JSONB object containing achievement name and description translations';
COMMENT ON COLUMN "Reward"."translations" IS 'JSONB object containing reward name and description translations';
COMMENT ON COLUMN "User"."preferred_locale" IS 'User preferred locale (ISO 639-1 code with optional region)';
COMMENT ON COLUMN "Organization"."default_locale" IS 'Organization default locale for content';

-- Example of translation structure in comments:
-- {
--   "de": {
--     "name": "Tiere lernen",
--     "description": "Lerne verschiedene Tiernamen auf Deutsch"
--   },
--   "en": {
--     "name": "Learning Animals", 
--     "description": "Learn different animal names in German"
--   }
-- }