-- Create medicines table for barcode scanning feature
-- This table stores medicine information that can be looked up by barcode

CREATE TABLE IF NOT EXISTS medicines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  generic_name text,
  barcode text UNIQUE NOT NULL,
  manufacturer text,
  dosage_form text,
  strength text,
  description text,
  instructions text,
  contraindications text,
  side_effects text,
  category text,
  prescription_required boolean DEFAULT false,
  storage_conditions text,
  expiry_date date,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create index on barcode for fast lookups
CREATE INDEX IF NOT EXISTS idx_medicines_barcode ON medicines(barcode);

-- Create index on name for search functionality
CREATE INDEX IF NOT EXISTS idx_medicines_name ON medicines(name);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_medicines_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_medicines_updated_at
  BEFORE UPDATE ON medicines
  FOR EACH ROW
  EXECUTE FUNCTION update_medicines_updated_at();

-- Enable Row Level Security (optional - adjust policies based on your needs)
ALTER TABLE medicines ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access (adjust based on your auth requirements)
CREATE POLICY "Allow public read access" ON medicines
  FOR SELECT USING (true);

-- Policy: Allow public insert (adjust based on your auth requirements)
CREATE POLICY "Allow public insert" ON medicines
  FOR INSERT WITH CHECK (true);

-- Policy: Allow public update (adjust based on your auth requirements)
CREATE POLICY "Allow public update" ON medicines
  FOR UPDATE USING (true);

-- Add comments for documentation
COMMENT ON TABLE medicines IS 'Stores medicine information for barcode scanning and lookup';
COMMENT ON COLUMN medicines.barcode IS 'EAN/UPC barcode - must be unique';
COMMENT ON COLUMN medicines.name IS 'Brand name of the medicine';
COMMENT ON COLUMN medicines.generic_name IS 'Generic name of the medicine';
COMMENT ON COLUMN medicines.prescription_required IS 'Whether a prescription is required for this medicine';

