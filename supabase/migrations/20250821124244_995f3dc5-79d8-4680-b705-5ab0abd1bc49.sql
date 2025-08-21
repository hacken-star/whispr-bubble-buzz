-- Fix function search path security warnings
CREATE OR REPLACE FUNCTION delete_expired_posts()
RETURNS void 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.posts WHERE expires_at < now();
  DELETE FROM public.comments WHERE expires_at < now();
  DELETE FROM public.reactions WHERE expires_at < now();
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_post_counts()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
AS $$
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