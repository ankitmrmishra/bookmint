CREATE TABLE "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"wallet" varchar(64) NOT NULL,
	"name" varchar(255),
	"username" varchar(20) NOT NULL,
	CONSTRAINT "users_wallet_unique" UNIQUE("wallet"),
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
