-- Create user_rentals table to track rental earnings
CREATE TABLE public.user_rentals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  amount NUMERIC NOT NULL DEFAULT 0,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_rentals ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own rentals" 
ON public.user_rentals 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own rentals" 
ON public.user_rentals 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own rentals" 
ON public.user_rentals 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own rentals" 
ON public.user_rentals 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_user_rentals_updated_at
BEFORE UPDATE ON public.user_rentals
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();