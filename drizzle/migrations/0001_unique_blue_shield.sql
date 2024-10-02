CREATE TABLE `job_stands` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`stand_number` integer NOT NULL,
	`company_name` text NOT NULL,
	`position_type` text NOT NULL,
	`viable` text NOT NULL
);
--> statement-breakpoint
ALTER TABLE ratings ADD `job_stand_id` integer REFERENCES job_stands(id);--> statement-breakpoint
/*
 SQLite does not support "Creating foreign key on existing column" out of the box, we do not generate automatic migration for that, so it has to be done manually
 Please refer to: https://www.techonthenet.com/sqlite/tables/alter_table.php
                  https://www.sqlite.org/lang_altertable.html

 Due to that we don't generate migration automatically and it has to be done manually
*/