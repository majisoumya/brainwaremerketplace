-- Add original_price column to products table for discount calculation
ALTER TABLE public.products 
ADD COLUMN original_price numeric DEFAULT NULL;

-- Add comment for clarity
COMMENT ON COLUMN public.products.original_price IS 'Original MRP price for discount calculation';