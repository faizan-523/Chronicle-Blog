-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'AUTHOR');

-- AlterTable
ALTER TABLE "Author" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'AUTHOR';
