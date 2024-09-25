-- AlterTable
ALTER TABLE `comments` MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT NOW(3),
    MODIFY `updated_at` DATETIME(3) NOT NULL DEFAULT NOW(3) ON UPDATE NOW(3);

-- AlterTable
ALTER TABLE `posts` MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT NOW(3),
    MODIFY `updated_at` DATETIME(3) NOT NULL DEFAULT NOW(3) ON UPDATE NOW(3);

-- AlterTable
ALTER TABLE `users` MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT NOW(3),
    MODIFY `updated_at` DATETIME(3) NOT NULL DEFAULT NOW(3) ON UPDATE NOW(3);
