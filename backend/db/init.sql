-- backend/db/init.sql
-- DDL + seed för Toads Delight

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Meny
CREATE TABLE IF NOT EXISTS products (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT        NOT NULL,
  description TEXT        NOT NULL,
  price       NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  category    TEXT        NOT NULL CHECK (category IN ('food', 'drink')),
  available   BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id          UUID  PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id TEXT  NOT NULL,
  status      TEXT  NOT NULL DEFAULT 'placed'
              CHECK (status IN ('placed', 'cooking', 'ready')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Orderrader
CREATE TABLE IF NOT EXISTS order_items (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id   UUID NOT NULL REFERENCES orders(id)   ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  quantity   INT  NOT NULL CHECK (quantity > 0)
);

-- ── Seed: grod-menyn ──────────────────────────────────────────────────────────

INSERT INTO products (name, description, price, category) VALUES
  ('Mygglarvssoppa',
   'Krämig soppa på färska mygglaver skördade från Dammens djupaste vrår',
   89.00, 'food'),

  ('Grillad Trollsländevinge',
   'Knapriga vingar marinerade i dammvatten, örter och ett stänk lera',
   125.00, 'food'),

  ('Daggmaskssallad',
   'Sallad med färska daggmaskar, bladverk och en krispig dammalgedressing',
   79.00, 'food'),

  ('Skalbaggestek med Rotmos',
   'Hel grillad skalbagge serveras med rotmos och sauterade lövlöss',
   145.00, 'food'),

  ('Dammgrönsaksgryta',
   'Säsongens näckrosor, vattenpest och andmat tillagat i paddspad',
   95.00, 'food'),

  ('Dammvatten Deluxe',
   'Filtrerat dammvatten med myntablad och handslagen isdammsörja',
   35.00, 'drink'),

  ('Algsmoothie',
   'Blend på grönalg, blåalg och lite andmat — det ultimata superfoodet',
   49.00, 'drink'),

  ('Grodäggsbubblate',
   'Grodägg i bubbelteformat med tapiokakulor, serveras iskall',
   55.00, 'drink'),

  ('Lövgrodsjuice',
   'Pressad saft av trädfrukt filtrerad genom lövgrodshänder för extra smak',
   45.00, 'drink'),

  ('Vändstek fluga',
   'Kom och som färska flugor, dom är skitgoda.',
   66.00, 'food'),

  ('Fermenterat nyckelpigge-IPA',
   'Bara finaste unga nyckelpigor av högsta kvalitet, väldigt riklig smak och du känner av prickarna vid varje klunk.',
   33.00, 'drink');
