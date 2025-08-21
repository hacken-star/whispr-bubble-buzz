-- Create universities table
CREATE TABLE public.universities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  short_name TEXT NOT NULL,
  state TEXT NOT NULL,
  x NUMERIC NOT NULL,
  y NUMERIC NOT NULL,
  color TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create posts table
CREATE TABLE public.posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  university_id UUID NOT NULL REFERENCES public.universities(id),
  content TEXT NOT NULL,
  image_url TEXT,
  video_url TEXT,
  likes_count INTEGER NOT NULL DEFAULT 0,
  comments_count INTEGER NOT NULL DEFAULT 0,
  views_count INTEGER NOT NULL DEFAULT 0,
  color TEXT NOT NULL DEFAULT 'whispr-blue',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + INTERVAL '7 days')
);

-- Create comments table
CREATE TABLE public.comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + INTERVAL '7 days')
);

-- Create reactions table for likes
CREATE TABLE public.reactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  reaction_type TEXT NOT NULL DEFAULT 'like',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + INTERVAL '7 days')
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.universities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reactions ENABLE ROW LEVEL SECURITY;

-- Create policies for anonymous access (no authentication required)
CREATE POLICY "Universities are viewable by everyone" 
ON public.universities FOR SELECT USING (true);

CREATE POLICY "Posts are viewable by everyone" 
ON public.posts FOR SELECT USING (true);

CREATE POLICY "Anyone can create posts" 
ON public.posts FOR INSERT WITH CHECK (true);

CREATE POLICY "Comments are viewable by everyone" 
ON public.comments FOR SELECT USING (true);

CREATE POLICY "Anyone can create comments" 
ON public.comments FOR INSERT WITH CHECK (true);

CREATE POLICY "Reactions are viewable by everyone" 
ON public.reactions FOR SELECT USING (true);

CREATE POLICY "Anyone can create reactions" 
ON public.reactions FOR INSERT WITH CHECK (true);

-- Insert universities data
INSERT INTO public.universities (name, short_name, state, x, y, color) VALUES
('Karl-Kumm University', 'KKU', 'Vom', 45, 25, 'whispr-purple'),
('ANAN University', 'ANAN', 'Kwall', 60, 30, 'whispr-teal'),
('Plateau State Polytechnic', 'PLAPOLY', 'Bukuru', 55, 35, 'whispr-pink'),
('Federal Polytechnic', 'FEDPOLY', 'Nyak Shendam', 50, 40, 'whispr-blue'),
('Federal College of Animal Health', 'FCAH', 'Vom', 40, 28, 'whispr-green'),
('Federal College of Forestry', 'FCF', 'Jos', 52, 32, 'whispr-yellow'),
('Federal College of Land Resources Tech', 'FCLRT', 'Kuru', 58, 38, 'whispr-orange'),
('Plateau State College of Agriculture', 'PSCA', 'Garkawa', 65, 45, 'whispr-purple'),
('Oswald College of Education', 'OCE', 'Shendam', 48, 42, 'whispr-teal'),
('Lowland College of Health', 'LCH', 'Pushit', 42, 33, 'whispr-pink'),
('School of Health', 'SOH', 'Pankshin', 56, 29, 'whispr-blue'),
('Prestigious College of Health', 'PCH', 'Mabudi', 38, 45, 'whispr-green'),
('College of Health', 'COH', 'Ajikamai', 62, 41, 'whispr-yellow'),
('Munan College of Health', 'MCH', 'Mangu', 44, 37, 'whispr-orange'),
('University of Abuja', 'UniAbuja', 'Gwalgwalada', 35, 50, 'whispr-blue'),
('University of Nigeria', 'UNN', 'Nsukka', 70, 60, 'whispr-pink'),
('University of Lagos', 'UNILAG', 'Lagos', 25, 70, 'whispr-green'),
('University of Port Harcourt', 'UNIPORT', 'Port Harcourt', 45, 80, 'whispr-yellow'),
('Ahmadu Bello University', 'ABU', 'Zaria', 30, 20, 'whispr-orange'),
('Abubakar Tafawa Balewa University', 'ATBU', 'Bauchi', 55, 15, 'whispr-purple'),
('University of Ibadan', 'UI', 'Ibadan', 20, 65, 'whispr-teal'),
('Veristors University', 'VU', 'Abuja', 33, 48, 'whispr-pink'),
('Delta State University', 'DELSU', 'Abraka', 40, 75, 'whispr-blue'),
('Abia State University', 'ABSU', 'Uturu', 60, 70, 'whispr-green');

-- Function to auto-delete expired posts
CREATE OR REPLACE FUNCTION delete_expired_posts()
RETURNS void AS $$
BEGIN
  DELETE FROM public.posts WHERE expires_at < now();
  DELETE FROM public.comments WHERE expires_at < now();
  DELETE FROM public.reactions WHERE expires_at < now();
END;
$$ LANGUAGE plpgsql;

-- Create trigger function for updating counts
CREATE OR REPLACE FUNCTION update_post_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF TG_TABLE_NAME = 'comments' THEN
      UPDATE public.posts 
      SET comments_count = comments_count + 1 
      WHERE id = NEW.post_id;
    ELSIF TG_TABLE_NAME = 'reactions' THEN
      UPDATE public.posts 
      SET likes_count = likes_count + 1 
      WHERE id = NEW.post_id;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    IF TG_TABLE_NAME = 'comments' THEN
      UPDATE public.posts 
      SET comments_count = comments_count - 1 
      WHERE id = OLD.post_id;
    ELSIF TG_TABLE_NAME = 'reactions' THEN
      UPDATE public.posts 
      SET likes_count = likes_count - 1 
      WHERE id = OLD.post_id;
    END IF;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for count updates
CREATE TRIGGER update_comments_count
  AFTER INSERT OR DELETE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION update_post_counts();

CREATE TRIGGER update_likes_count
  AFTER INSERT OR DELETE ON public.reactions
  FOR EACH ROW EXECUTE FUNCTION update_post_counts();