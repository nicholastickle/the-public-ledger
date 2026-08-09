ALTER TABLE bills ADD COLUMN IF NOT EXISTS detail_url TEXT;

UPDATE bills
SET detail_url = 'https://bills.parliament.uk/bills/' || id
WHERE detail_url IS NULL;
