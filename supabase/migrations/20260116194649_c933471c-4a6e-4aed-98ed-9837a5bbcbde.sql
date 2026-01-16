-- Create table for clients
CREATE TABLE public.clients (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    birth_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for treatment types (catalog)
CREATE TABLE public.treatment_types (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    duration_minutes INTEGER DEFAULT 60,
    price DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for treatment sessions (performed treatments)
CREATE TABLE public.treatment_sessions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    treatment_type_id UUID NOT NULL REFERENCES public.treatment_types(id) ON DELETE RESTRICT,
    session_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    operator_name TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for annotations (notes/modifications on sessions)
CREATE TABLE public.session_annotations (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    treatment_session_id UUID NOT NULL REFERENCES public.treatment_sessions(id) ON DELETE CASCADE,
    annotation TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables (with public access since no auth)
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.treatment_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.treatment_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_annotations ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (no auth required)
CREATE POLICY "Allow public read access on clients" ON public.clients FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on clients" ON public.clients FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on clients" ON public.clients FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access on clients" ON public.clients FOR DELETE USING (true);

CREATE POLICY "Allow public read access on treatment_types" ON public.treatment_types FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on treatment_types" ON public.treatment_types FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on treatment_types" ON public.treatment_types FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access on treatment_types" ON public.treatment_types FOR DELETE USING (true);

CREATE POLICY "Allow public read access on treatment_sessions" ON public.treatment_sessions FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on treatment_sessions" ON public.treatment_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on treatment_sessions" ON public.treatment_sessions FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access on treatment_sessions" ON public.treatment_sessions FOR DELETE USING (true);

CREATE POLICY "Allow public read access on session_annotations" ON public.session_annotations FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on session_annotations" ON public.session_annotations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on session_annotations" ON public.session_annotations FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access on session_annotations" ON public.session_annotations FOR DELETE USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_clients_updated_at
    BEFORE UPDATE ON public.clients
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_treatment_types_updated_at
    BEFORE UPDATE ON public.treatment_types
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_treatment_sessions_updated_at
    BEFORE UPDATE ON public.treatment_sessions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some default treatment types
INSERT INTO public.treatment_types (name, description, duration_minutes, price) VALUES
    ('Massaggio Rilassante', 'Massaggio corpo completo per rilassamento totale', 60, 70.00),
    ('Manicure', 'Cura completa delle unghie delle mani', 45, 25.00),
    ('Pedicure', 'Cura completa delle unghie dei piedi', 60, 35.00),
    ('Pulizia Viso', 'Trattamento viso purificante e idratante', 45, 55.00),
    ('Ceretta Gambe', 'Depilazione gambe complete', 30, 30.00),
    ('Ceretta Braccia', 'Depilazione braccia complete', 20, 20.00);