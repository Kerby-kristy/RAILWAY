-- CreateTable
CREATE TABLE `Higgsfield` (
    `id` VARCHAR(191) NOT NULL,
    `enabled` BOOLEAN NOT NULL DEFAULT true,
    `description` VARCHAR(255),
    `serverUrl` VARCHAR(500) NOT NULL,
    `apiKey` VARCHAR(255),
    `toolName` VARCHAR(100),
    `quality` VARCHAR(20),
    `expire` INTEGER DEFAULT 0,
    `keywordFinish` VARCHAR(100),
    `delayMessage` INTEGER,
    `unknownMessage` VARCHAR(100),
    `listeningFromMe` BOOLEAN DEFAULT false,
    `stopBotFromMe` BOOLEAN DEFAULT false,
    `keepOpen` BOOLEAN DEFAULT false,
    `debounceTime` INTEGER,
    `ignoreJids` JSON,
    `splitMessages` BOOLEAN DEFAULT false,
    `timePerChar` INTEGER DEFAULT 50,
    `triggerType` ENUM('all', 'keyword', 'none') NULL,
    `triggerOperator` ENUM('contains', 'equals', 'startsWith', 'endsWith', 'regex') NULL,
    `triggerValue` VARCHAR(191) NULL,
    `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` TIMESTAMP NOT NULL,
    `instanceId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HiggsfieldSetting` (
    `id` VARCHAR(191) NOT NULL,
    `expire` INTEGER DEFAULT 0,
    `keywordFinish` VARCHAR(100),
    `delayMessage` INTEGER,
    `unknownMessage` VARCHAR(100),
    `listeningFromMe` BOOLEAN DEFAULT false,
    `stopBotFromMe` BOOLEAN DEFAULT false,
    `keepOpen` BOOLEAN DEFAULT false,
    `debounceTime` INTEGER,
    `ignoreJids` JSON,
    `splitMessages` BOOLEAN DEFAULT false,
    `timePerChar` INTEGER DEFAULT 50,
    `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` TIMESTAMP NOT NULL,
    `higgsfieldIdFallback` VARCHAR(100),
    `instanceId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `HiggsfieldSetting_instanceId_key` ON `HiggsfieldSetting`(`instanceId`);

-- AddForeignKey
ALTER TABLE `Higgsfield` ADD CONSTRAINT `Higgsfield_instanceId_fkey` FOREIGN KEY (`instanceId`) REFERENCES `Instance`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HiggsfieldSetting` ADD CONSTRAINT `HiggsfieldSetting_higgsfieldIdFallback_fkey` FOREIGN KEY (`higgsfieldIdFallback`) REFERENCES `Higgsfield`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HiggsfieldSetting` ADD CONSTRAINT `HiggsfieldSetting_instanceId_fkey` FOREIGN KEY (`instanceId`) REFERENCES `Instance`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
