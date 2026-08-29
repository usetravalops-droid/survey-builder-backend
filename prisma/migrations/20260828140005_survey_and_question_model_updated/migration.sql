-- AlterTable
ALTER TABLE `question` ADD COLUMN `condition` JSON NULL,
    ADD COLUMN `required` BOOLEAN NOT NULL DEFAULT false;
