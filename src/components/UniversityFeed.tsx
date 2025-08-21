import { Heart, MessageCircle, Eye, Plus, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Post {
  id: string;
  text: string;
  imageUrl?: string;
  likes: number;
  comments: number;
  views: number;
  timeAgo: string;
  color: string;
}

interface UniversityFeedProps {
  universityName: string;
  onBack: () => void;
  onCreatePost: () => void;
  onPostClick: (post: Post) => void;
}

const mockPosts: Post[] = [
  {
    id: "1",
    text: "Finals week is killing me! Anyone else pulling all-nighters? 😭",
    likes: 24,
    comments: 8,
    views: 156,
    timeAgo: "2h",
    color: "whispr-blue"
  },
  {
    id: "2", 
    text: "The cafeteria food today was actually good for once! What happened? 😂",
    likes: 18,
    comments: 12,
    views: 89,
    timeAgo: "4h",
    color: "whispr-green"
  },
  {
    id: "3",
    text: "Prof Johnson's lecture was so confusing today. Did anyone understand the quantum mechanics part?",
    likes: 31,
    comments: 15,
    views: 203,
    timeAgo: "6h", 
    color: "whispr-pink"
  },
  {
    id: "4",
    text: "Campus WiFi is down AGAIN. How are we supposed to submit assignments? 🤦‍♀️",
    likes: 45,
    comments: 23,
    views: 178,
    timeAgo: "8h",
    color: "whispr-purple"
  },
  {
    id: "5",
    text: "Found a lost wallet near the library. DM me if it's yours!",
    likes: 67,
    comments: 5,
    views: 234,
    timeAgo: "12h",
    color: "whispr-yellow"
  },
  {
    id: "6",
    text: "The new student center looks amazing! Finally somewhere decent to hang out 🎉",
    likes: 52,
    comments: 19,
    views: 167,
    timeAgo: "1d",
    color: "whispr-orange"
  }
];

const UniversityFeed = ({ universityName, onBack, onCreatePost, onPostClick }: UniversityFeedProps) => {
  return (
    <div className="min-h-screen bg-gradient-map">
      {/* Header */}
      <div className="sticky top-0 bg-white/90 backdrop-blur-lg border-b border-border z-10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-foreground">{universityName}</h1>
              <p className="text-sm text-muted-foreground">Anonymous Feed</p>
            </div>
          </div>
          <Button 
            onClick={onCreatePost}
            className="rounded-full w-12 h-12 bg-gradient-primary shadow-bubble hover:shadow-bubble-glow"
            size="icon"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Feed */}
      <div className="p-4 space-y-6">
        {mockPosts.map((post, index) => (
          <div
            key={post.id}
            className="relative cursor-pointer group"
            onClick={() => onPostClick(post)}
            style={{
              animationDelay: `${index * 0.1}s`
            }}
          >
            {/* Bubble Post */}
            <div 
              className={`relative rounded-3xl p-6 shadow-bubble transition-all duration-300 group-hover:shadow-bubble-glow group-hover:scale-105 animate-bubble-pop`}
              style={{
                backgroundColor: `hsl(var(--whispr-${post.color.split('-')[1]}) / 0.9)`,
                animationDelay: `${index * 0.2}s`
              }}
            >
              {/* Floating animation */}
              <div className="animate-bubble-float">
                {/* Post Content */}
                <div className="text-white mb-4">
                  <p className="text-sm leading-relaxed font-medium">{post.text}</p>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-white/80">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      <span className="text-xs font-medium">{post.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" />
                      <span className="text-xs font-medium">{post.comments}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span className="text-xs font-medium">{post.views}</span>
                    </div>
                  </div>
                  <span className="text-xs">{post.timeAgo}</span>
                </div>
              </div>

              {/* Bubble Glow Effect */}
              <div className="absolute inset-0 rounded-3xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State Message */}
      {mockPosts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="w-24 h-24 rounded-full bg-gradient-bubble flex items-center justify-center mb-4 shadow-bubble">
            <MessageCircle className="h-12 w-12 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">No posts yet</h3>
          <p className="text-muted-foreground text-center mb-6">Be the first to share something with your classmates!</p>
          <Button 
            onClick={onCreatePost}
            className="bg-gradient-primary text-white rounded-full px-8 py-3 shadow-bubble hover:shadow-bubble-glow"
          >
            Create First Post
          </Button>
        </div>
      )}
    </div>
  );
};

export default UniversityFeed;