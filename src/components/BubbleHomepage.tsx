import { useState, useEffect } from "react";
import { Heart, MessageCircle, Eye, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";

interface Post {
  id: string;
  content: string;
  image_url?: string;
  video_url?: string;
  likes_count: number;
  comments_count: number;
  views_count: number;
  color: string;
  created_at: string;
  university_id: string;
  universities?: {
    name: string;
    short_name: string;
  };
}

interface BubbleHomepageProps {
  onCreatePost: () => void;
  onPostClick: (post: any) => void;
}

const BubbleHomepage = ({ onCreatePost, onPostClick }: BubbleHomepageProps) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          universities (
            name,
            short_name
          )
        `)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Error fetching posts:', error);
        return;
      }

      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      // Add reaction
      const { error } = await supabase
        .from('reactions')
        .insert({ post_id: postId, reaction_type: 'like' });

      if (error) {
        console.error('Error adding like:', error);
        return;
      }

      // Update local state
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, likes_count: post.likes_count + 1 }
          : post
      ));
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handlePostClick = async (post: Post) => {
    // Increment view count
    try {
      await supabase
        .from('posts')
        .update({ views_count: post.views_count + 1 })
        .eq('id', post.id);

      // Update local state
      setPosts(prev => prev.map(p => 
        p.id === post.id 
          ? { ...p, views_count: p.views_count + 1 }
          : p
      ));
    } catch (error) {
      console.error('Error updating view count:', error);
    }

    onPostClick(post);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-map p-4 flex items-center justify-center">
        <div className="text-xl text-foreground">Loading posts...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-map p-4 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-foreground">Whispr</h1>
        <Button 
          onClick={onCreatePost}
          className="rounded-full w-12 h-12 bg-gradient-primary shadow-bubble hover:shadow-bubble-glow transition-all duration-300"
          size="icon"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      {/* Posts Container - Bubble Chat Style */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">No posts yet</div>
            <Button onClick={onCreatePost} className="bg-gradient-primary text-white">
              Create the first post
            </Button>
          </div>
        ) : (
          posts.map((post, index) => (
            <div
              key={post.id}
              className={`relative max-w-[80%] ${
                index % 2 === 0 ? 'ml-auto' : 'mr-auto'
              }`}
            >
              {/* Chat Bubble */}
              <div
                className={`
                  relative p-4 rounded-3xl cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-bubble-glow
                  ${index % 2 === 0 ? 'rounded-tr-lg' : 'rounded-tl-lg'}
                `}
                style={{ 
                  backgroundColor: `hsl(var(--whispr-${post.color.split('-')[1] || 'blue'}))`,
                }}
                onClick={() => handlePostClick(post)}
              >
                {/* Post Content */}
                <div className="text-white font-medium text-sm mb-3">
                  {post.content}
                </div>

                {/* University Tag */}
                <div className="text-white/70 text-xs mb-2 font-medium">
                  {post.universities?.short_name || 'Unknown'}
                </div>

                {/* Media Preview */}
                {post.image_url && (
                  <div className="mt-2 rounded-2xl overflow-hidden max-w-[200px]">
                    <img 
                      src={post.image_url} 
                      alt="Post media"
                      className="w-full h-32 object-cover"
                    />
                  </div>
                )}

                {post.video_url && (
                  <div className="mt-2 rounded-2xl overflow-hidden max-w-[200px] relative">
                    <video 
                      src={post.video_url}
                      className="w-full h-32 object-cover"
                      controls={false}
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center">
                        <div className="w-0 h-0 border-l-[6px] border-l-white border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent ml-1"></div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Stats */}
                <div className="flex items-center gap-3 mt-3 text-white/80">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike(post.id);
                    }}
                    className="flex items-center gap-1 hover:text-white transition-colors"
                  >
                    <Heart className="h-4 w-4" />
                    <span className="text-xs">{post.likes_count}</span>
                  </button>
                  
                  <div className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" />
                    <span className="text-xs">{post.comments_count}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span className="text-xs">{post.views_count}</span>
                  </div>
                  
                  <div className="ml-auto text-xs">
                    {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                  </div>
                </div>

                {/* Chat Tail */}
                <div 
                  className={`absolute top-4 w-4 h-4 ${
                    index % 2 === 0 
                      ? 'right-[-8px] rounded-bl-full' 
                      : 'left-[-8px] rounded-br-full'
                  }`}
                  style={{ 
                    backgroundColor: `hsl(var(--whispr-${post.color.split('-')[1] || 'blue'}))`,
                  }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BubbleHomepage;