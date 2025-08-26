-- Fix RLS security issue for views table
ALTER TABLE public.views ENABLE ROW LEVEL SECURITY;

-- Create policies for views table
CREATE POLICY "Anyone can view product views" 
ON public.views 
FOR SELECT 
USING (true);

CREATE POLICY "Users can record views" 
ON public.views 
FOR INSERT 
WITH CHECK (true);