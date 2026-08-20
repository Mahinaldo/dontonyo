CREATE TABLE `supabasePracticeAttemptQuestions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`attemptId` int NOT NULL,
	`externalMcqId` varchar(36) NOT NULL,
	`selectedOption` varchar(8) NOT NULL,
	`correctOption` varchar(8) NOT NULL,
	`isCorrect` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `supabasePracticeAttemptQuestions_id` PRIMARY KEY(`id`),
	CONSTRAINT `supabase_practice_attempt_question_unique` UNIQUE(`attemptId`,`externalMcqId`)
);
--> statement-breakpoint
ALTER TABLE `supabasePracticeAttemptQuestions` ADD CONSTRAINT `supabasePracticeAttemptQuestions_attemptId_quizAttempts_id_fk` FOREIGN KEY (`attemptId`) REFERENCES `quizAttempts`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `supabase_practice_attempt_idx` ON `supabasePracticeAttemptQuestions` (`attemptId`);