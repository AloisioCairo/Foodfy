CREATE TABLE public.users (
	id serial NOT NULL,
	name TEXT NOT NULL,
	email TEXT NOT NULL,
	"password" TEXT NOT NULL,
	reset_token TEXT NULL,
	reset_token_expires TEXT NULL,
	is_admin BOOLEAN DEFAULT false,
	created_at timestamp DEFAULT now(),
	updated_at timestamp DEFAULT now(),
	CONSTRAINT users_email_key UNIQUE (email),
	CONSTRAINT users_pkey PRIMARY KEY (id)
);

CREATE TABLE public.files (
	id serial NOT NULL,
	"name" text NOT NULL,
	"path" text NOT NULL,
	CONSTRAINT files_pkey PRIMARY KEY (id)
);

CREATE TABLE public.chefs (
	id serial NOT NULL,
	"name" text NOT NULL,
	created_at timestamptz NULL,
	file_id int4 NULL,
	CONSTRAINT chefs_pkey PRIMARY KEY (id),
	CONSTRAINT chefs_file_id_fkey FOREIGN KEY (file_id) REFERENCES files(id)
);

CREATE TABLE public.recipes (
	id serial NOT NULL,
	chef_id int4 NULL,
	title text NULL,
	ingredients _text NULL,
	preparation _text NULL,
	information text NULL,
	created_at timestamptz NULL,
	updated_at timestamptz NULL,
	CONSTRAINT recipes_pkey PRIMARY KEY (id),
	CONSTRAINT fk_recipes_chefe_id FOREIGN KEY (chef_id) REFERENCES chefs(id) NOT VALID
    CONSTRAINT fk_recipes_user_id FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE INDEX fki_fk_recipes_chefe_id ON public.recipes USING btree (chef_id);

CREATE TABLE public.recipe_files (
	id serial NOT NULL,
	recipe_id int4 NOT NULL,
	file_id int4 NOT NULL,
	CONSTRAINT recipe_files_pkey PRIMARY KEY (id),
	CONSTRAINT recipe_files_file_id_fkey FOREIGN KEY (file_id) REFERENCES files(id),
	CONSTRAINT recipe_files_recipe_id_fkey FOREIGN KEY (recipe_id) REFERENCES recipes(id)
);

CREATE TABLE public."session" (
	sid varchar NOT NULL,
	sess json NOT NULL,
	expire timestamp NOT NULL,
	CONSTRAINT session_pkey PRIMARY KEY (sid)
);




-- CREATION OF FUNCTIONS
CREATE OR REPLACE FUNCTION public.trigger_set_timestamp()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
	NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$
;




-- Table Triggers
create trigger trigger_set_timestamp before
update
    on
    public.recipes for each row execute function trigger_set_timestamp();