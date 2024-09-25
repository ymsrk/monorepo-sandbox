-- AlterTable
ALTER TABLE `comments` MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT NOW(3),
    MODIFY `updated_at` DATETIME(3) NOT NULL DEFAULT NOW(3) ON UPDATE NOW(3);

-- AlterTable
ALTER TABLE `posts` MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT NOW(3),
    MODIFY `updated_at` DATETIME(3) NOT NULL DEFAULT NOW(3) ON UPDATE NOW(3);

-- AlterTable
ALTER TABLE `users` MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT NOW(3),
    MODIFY `updated_at` DATETIME(3) NOT NULL DEFAULT NOW(3) ON UPDATE NOW(3);

-- CreateTable
CREATE TABLE `post_dates` (
    `id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT NOW(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT NOW(3) ON UPDATE NOW(3),
    `post_created_at` DATETIME(3) NOT NULL,
    `post_updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
