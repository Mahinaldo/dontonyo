CREATE TABLE `books` (
	`id` int AUTO_INCREMENT NOT NULL,
	`subjectId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`slug` varchar(160) NOT NULL,
	`description` text,
	`sourceType` varchar(80) NOT NULL DEFAULT 'source-book',
	`displayOrder` int NOT NULL DEFAULT 0,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `books_id` PRIMARY KEY(`id`),
	CONSTRAINT `books_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `chapters` (
	`id` int AUTO_INCREMENT NOT NULL,
	`bookId` int NOT NULL,
	`chapterNumber` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`slug` varchar(160) NOT NULL,
	`description` text,
	`displayOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `chapters_id` PRIMARY KEY(`id`),
	CONSTRAINT `chapters_book_number_unique` UNIQUE(`bookId`,`chapterNumber`),
	CONSTRAINT `chapters_book_slug_unique` UNIQUE(`bookId`,`slug`)
);
--> statement-breakpoint
CREATE TABLE `dailyProgress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`progressDate` varchar(10) NOT NULL,
	`goal` int NOT NULL DEFAULT 10,
	`completedActivities` int NOT NULL DEFAULT 0,
	`quizCount` int NOT NULL DEFAULT 0,
	`learningCount` int NOT NULL DEFAULT 0,
	`xp` int NOT NULL DEFAULT 0,
	`isComplete` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `dailyProgress_id` PRIMARY KEY(`id`),
	CONSTRAINT `daily_progress_user_date_unique` UNIQUE(`userId`,`progressDate`)
);
--> statement-breakpoint
CREATE TABLE `examSources` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`institution` varchar(255),
	`examType` varchar(120),
	`description` text,
	CONSTRAINT `examSources_id` PRIMARY KEY(`id`),
	CONSTRAINT `exam_sources_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `flashcards` (
	`id` int AUTO_INCREMENT NOT NULL,
	`subjectId` int NOT NULL,
	`bookId` int NOT NULL,
	`chapterId` int NOT NULL,
	`topicId` int,
	`frontText` text NOT NULL,
	`backText` text NOT NULL,
	`sourceType` varchar(32) NOT NULL,
	`sourceId` int NOT NULL,
	`sourceKey` varchar(96) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `flashcards_id` PRIMARY KEY(`id`),
	CONSTRAINT `flashcards_source_unique` UNIQUE(`sourceType`,`sourceId`)
);
--> statement-breakpoint
CREATE TABLE `gkFacts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`bookId` int NOT NULL,
	`chapterId` int NOT NULL,
	`topicId` int,
	`title` varchar(255),
	`factText` text NOT NULL,
	`explanation` text,
	`sourcePage` int,
	`sourceSection` varchar(255),
	`confidence` enum('high','medium','low') NOT NULL DEFAULT 'medium',
	`idempotencyKey` varchar(64) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `gkFacts_id` PRIMARY KEY(`id`),
	CONSTRAINT `gk_facts_idempotency_unique` UNIQUE(`idempotencyKey`)
);
--> statement-breakpoint
CREATE TABLE `gkMcqOptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`mcqId` int NOT NULL,
	`optionKey` varchar(8) NOT NULL,
	`optionText` text NOT NULL,
	`displayOrder` int NOT NULL DEFAULT 0,
	`isCorrect` boolean NOT NULL DEFAULT false,
	CONSTRAINT `gkMcqOptions_id` PRIMARY KEY(`id`),
	CONSTRAINT `gk_mcq_options_key_unique` UNIQUE(`mcqId`,`optionKey`)
);
--> statement-breakpoint
CREATE TABLE `gkMcqSources` (
	`mcqId` int NOT NULL,
	`examSourceId` int NOT NULL,
	`year` int,
	`session` varchar(80),
	`sourceText` text,
	CONSTRAINT `gkMcqSources_mcqId_examSourceId_pk` PRIMARY KEY(`mcqId`,`examSourceId`)
);
--> statement-breakpoint
CREATE TABLE `gkMcqs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`bookId` int NOT NULL,
	`chapterId` int NOT NULL,
	`topicId` int,
	`question` text NOT NULL,
	`correctOption` varchar(8),
	`explanation` text,
	`sourcePage` int,
	`sourceQuestionNumber` varchar(32),
	`difficulty` enum('easy','medium','hard'),
	`confidence` enum('high','medium','low') NOT NULL DEFAULT 'medium',
	`sourceHash` varchar(64) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `gkMcqs_id` PRIMARY KEY(`id`),
	CONSTRAINT `gk_mcqs_source_hash_unique` UNIQUE(`sourceHash`)
);
--> statement-breakpoint
CREATE TABLE `gkNotes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`bookId` int NOT NULL,
	`chapterId` int NOT NULL,
	`topicId` int,
	`title` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`sourcePage` int,
	`displayOrder` int NOT NULL DEFAULT 0,
	`confidence` enum('high','medium','low') NOT NULL DEFAULT 'medium',
	`idempotencyKey` varchar(64) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `gkNotes_id` PRIMARY KEY(`id`),
	CONSTRAINT `gk_notes_idempotency_unique` UNIQUE(`idempotencyKey`)
);
--> statement-breakpoint
CREATE TABLE `profiles` (
	`userId` int NOT NULL,
	`displayName` varchar(160),
	`avatarUrl` varchar(500),
	`onboardingComplete` boolean NOT NULL DEFAULT false,
	`selectedBookId` int,
	`dailyGoal` int NOT NULL DEFAULT 10,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `profiles_userId` PRIMARY KEY(`userId`)
);
--> statement-breakpoint
CREATE TABLE `quizAttemptQuestions` (
	`attemptId` int NOT NULL,
	`mcqId` int NOT NULL,
	`selectedOption` varchar(8),
	`isCorrect` boolean NOT NULL DEFAULT false,
	CONSTRAINT `quizAttemptQuestions_attemptId_mcqId_pk` PRIMARY KEY(`attemptId`,`mcqId`)
);
--> statement-breakpoint
CREATE TABLE `quizAttempts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`quizType` varchar(40) NOT NULL,
	`bookId` int,
	`chapterId` int,
	`topicId` int,
	`totalQuestions` int NOT NULL,
	`correctAnswers` int NOT NULL DEFAULT 0,
	`completedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `quizAttempts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `searchDocuments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`entityType` varchar(32) NOT NULL,
	`entityId` int NOT NULL,
	`title` text,
	`body` text NOT NULL,
	`englishMetadata` text,
	`searchText` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `searchDocuments_id` PRIMARY KEY(`id`),
	CONSTRAINT `search_documents_entity_unique` UNIQUE(`entityType`,`entityId`)
);
--> statement-breakpoint
CREATE TABLE `subjects` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(120) NOT NULL,
	`slug` varchar(120) NOT NULL,
	`description` text,
	`displayOrder` int NOT NULL DEFAULT 0,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `subjects_id` PRIMARY KEY(`id`),
	CONSTRAINT `subjects_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `topics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`chapterId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`slug` varchar(160) NOT NULL,
	`description` text,
	`displayOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `topics_id` PRIMARY KEY(`id`),
	CONSTRAINT `topics_chapter_slug_unique` UNIQUE(`chapterId`,`slug`)
);
--> statement-breakpoint
CREATE TABLE `userContentProgress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`contentType` enum('fact','note','flashcard','chapter','topic','mcq') NOT NULL,
	`contentId` int NOT NULL,
	`status` enum('new','in_progress','completed','needs_review') NOT NULL DEFAULT 'new',
	`known` boolean NOT NULL DEFAULT false,
	`timesSeen` int NOT NULL DEFAULT 0,
	`correctCount` int NOT NULL DEFAULT 0,
	`incorrectCount` int NOT NULL DEFAULT 0,
	`lastSeenAt` timestamp,
	`nextReviewAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `userContentProgress_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_content_progress_unique` UNIQUE(`userId`,`contentType`,`contentId`)
);
--> statement-breakpoint
ALTER TABLE `books` ADD CONSTRAINT `books_subjectId_subjects_id_fk` FOREIGN KEY (`subjectId`) REFERENCES `subjects`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `chapters` ADD CONSTRAINT `chapters_bookId_books_id_fk` FOREIGN KEY (`bookId`) REFERENCES `books`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `dailyProgress` ADD CONSTRAINT `dailyProgress_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `flashcards` ADD CONSTRAINT `flashcards_subjectId_subjects_id_fk` FOREIGN KEY (`subjectId`) REFERENCES `subjects`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `flashcards` ADD CONSTRAINT `flashcards_bookId_books_id_fk` FOREIGN KEY (`bookId`) REFERENCES `books`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `flashcards` ADD CONSTRAINT `flashcards_chapterId_chapters_id_fk` FOREIGN KEY (`chapterId`) REFERENCES `chapters`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `flashcards` ADD CONSTRAINT `flashcards_topicId_topics_id_fk` FOREIGN KEY (`topicId`) REFERENCES `topics`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `gkFacts` ADD CONSTRAINT `gkFacts_bookId_books_id_fk` FOREIGN KEY (`bookId`) REFERENCES `books`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `gkFacts` ADD CONSTRAINT `gkFacts_chapterId_chapters_id_fk` FOREIGN KEY (`chapterId`) REFERENCES `chapters`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `gkFacts` ADD CONSTRAINT `gkFacts_topicId_topics_id_fk` FOREIGN KEY (`topicId`) REFERENCES `topics`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `gkMcqOptions` ADD CONSTRAINT `gkMcqOptions_mcqId_gkMcqs_id_fk` FOREIGN KEY (`mcqId`) REFERENCES `gkMcqs`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `gkMcqSources` ADD CONSTRAINT `gkMcqSources_mcqId_gkMcqs_id_fk` FOREIGN KEY (`mcqId`) REFERENCES `gkMcqs`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `gkMcqSources` ADD CONSTRAINT `gkMcqSources_examSourceId_examSources_id_fk` FOREIGN KEY (`examSourceId`) REFERENCES `examSources`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `gkMcqs` ADD CONSTRAINT `gkMcqs_bookId_books_id_fk` FOREIGN KEY (`bookId`) REFERENCES `books`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `gkMcqs` ADD CONSTRAINT `gkMcqs_chapterId_chapters_id_fk` FOREIGN KEY (`chapterId`) REFERENCES `chapters`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `gkMcqs` ADD CONSTRAINT `gkMcqs_topicId_topics_id_fk` FOREIGN KEY (`topicId`) REFERENCES `topics`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `gkNotes` ADD CONSTRAINT `gkNotes_bookId_books_id_fk` FOREIGN KEY (`bookId`) REFERENCES `books`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `gkNotes` ADD CONSTRAINT `gkNotes_chapterId_chapters_id_fk` FOREIGN KEY (`chapterId`) REFERENCES `chapters`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `gkNotes` ADD CONSTRAINT `gkNotes_topicId_topics_id_fk` FOREIGN KEY (`topicId`) REFERENCES `topics`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `profiles` ADD CONSTRAINT `profiles_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `profiles` ADD CONSTRAINT `profiles_selectedBookId_books_id_fk` FOREIGN KEY (`selectedBookId`) REFERENCES `books`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `quizAttemptQuestions` ADD CONSTRAINT `quizAttemptQuestions_attemptId_quizAttempts_id_fk` FOREIGN KEY (`attemptId`) REFERENCES `quizAttempts`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `quizAttemptQuestions` ADD CONSTRAINT `quizAttemptQuestions_mcqId_gkMcqs_id_fk` FOREIGN KEY (`mcqId`) REFERENCES `gkMcqs`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `quizAttempts` ADD CONSTRAINT `quizAttempts_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `quizAttempts` ADD CONSTRAINT `quizAttempts_bookId_books_id_fk` FOREIGN KEY (`bookId`) REFERENCES `books`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `quizAttempts` ADD CONSTRAINT `quizAttempts_chapterId_chapters_id_fk` FOREIGN KEY (`chapterId`) REFERENCES `chapters`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `quizAttempts` ADD CONSTRAINT `quizAttempts_topicId_topics_id_fk` FOREIGN KEY (`topicId`) REFERENCES `topics`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `topics` ADD CONSTRAINT `topics_chapterId_chapters_id_fk` FOREIGN KEY (`chapterId`) REFERENCES `chapters`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `userContentProgress` ADD CONSTRAINT `userContentProgress_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `books_subject_idx` ON `books` (`subjectId`);--> statement-breakpoint
CREATE INDEX `daily_progress_user_date_idx` ON `dailyProgress` (`userId`,`progressDate`);--> statement-breakpoint
CREATE INDEX `flashcards_chapter_idx` ON `flashcards` (`chapterId`,`topicId`);--> statement-breakpoint
CREATE INDEX `gk_facts_search_idx` ON `gkFacts` (`chapterId`,`topicId`);--> statement-breakpoint
CREATE INDEX `gk_facts_book_idx` ON `gkFacts` (`bookId`);--> statement-breakpoint
CREATE INDEX `gk_mcq_options_mcq_idx` ON `gkMcqOptions` (`mcqId`);--> statement-breakpoint
CREATE INDEX `gk_mcq_sources_exam_idx` ON `gkMcqSources` (`examSourceId`,`year`);--> statement-breakpoint
CREATE INDEX `gk_mcqs_chapter_idx` ON `gkMcqs` (`chapterId`,`topicId`);--> statement-breakpoint
CREATE INDEX `gk_mcqs_source_page_idx` ON `gkMcqs` (`sourcePage`);--> statement-breakpoint
CREATE INDEX `gk_notes_chapter_idx` ON `gkNotes` (`chapterId`,`topicId`);--> statement-breakpoint
CREATE INDEX `quiz_attempts_user_completed_idx` ON `quizAttempts` (`userId`,`completedAt`);--> statement-breakpoint
CREATE INDEX `search_documents_entity_idx` ON `searchDocuments` (`entityType`,`entityId`);--> statement-breakpoint
CREATE INDEX `topics_chapter_idx` ON `topics` (`chapterId`);--> statement-breakpoint
CREATE INDEX `user_content_progress_user_idx` ON `userContentProgress` (`userId`,`status`,`nextReviewAt`);