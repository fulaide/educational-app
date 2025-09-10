-- CreateEnum
CREATE TYPE "public"."AvatarType" AS ENUM ('PRESET', 'CUSTOM');

-- AlterTable
ALTER TABLE "public"."classes" ADD COLUMN     "avatarType" "public"."AvatarType" NOT NULL DEFAULT 'PRESET',
ADD COLUMN     "avatarUrl" TEXT;
