import { useState } from "react";
import { ArrowLeft, Heart, MessageCircle, Eye, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Comment {
  id: string;
  text: string;
  timeAgo: string;
  likes: number;
}

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

interface PostDetailProps {
  post: Post;
  onBack: () => void;
}

const mockComments: Comment[] = [
  {
    id: "1",
    text: "Same here! I've been surviving on coffee and determination 😅",
    timeAgo: "1h",
    likes: 8
  },
  {
    id: "2", 
    text: "Try the library's quiet study rooms on the 3rd floor. Much better for focus!",
    timeAgo: "45m",
    likes: 12
  },
  {
    id: "3",
    text: "We should form a study group! DM me if you're interested 📚",
    timeAgo: "30m", 
    likes: 15
  }
];

const PostDetail = ({ post, onBack }: PostDetailProps) => {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState(mockComments);
  const [isLiked, setIsLiked] = useState(false);

  const handleSubmitComment = () => {
    if (!commentText.trim()) return;
    
    const newComment: Comment = {
      id: Date.now().toString(),
      text: commentText,
      timeAgo: "now",
      likes: 0
    };
    
    setComments([newComment, ...comments]);
    setCommentText("");
  };

  return (
    <div className="min-h-screen bg-gradient-map">
      {/* Header */}
      <div className="sticky top-0 bg-white/90 backdrop-blur-lg border-b border-border z-10">
        <div className="flex items-center gap-3 p-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground">Post</h1>
            <p className="text-sm text-muted-foreground">Anonymous Discussion</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Main Post */}
        <div className="relative">
          <div 
            className="rounded-3xl p-6 shadow-bubble"
            style={{
              backgroundColor: `hsl(var(--whispr-${post.color.split('-')[1]}) / 0.9)`
            }}
          >
            <div className="text-white mb-4">
              <p className="text-base leading-relaxed font-medium">{post.text}</p>
            </div>

            {/* Interaction Bar */}
            <div className="flex items-center justify-between text-white/80 mb-4">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsLiked(!isLiked)}
                  className={`text-white/80 hover:text-white hover:bg-white/10 ${isLiked ? 'text-red-300' : ''}`}
                >
                  <Heart className={`h-4 w-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
                  <span className="text-sm font-medium">{post.likes + (isLiked ? 1 : 0)}</span>
                </Button>
                <div className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">{comments.length}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span className="text-sm font-medium">{post.views}</span>
                </div>
              </div>
              <span className="text-sm">{post.timeAgo}</span>
            </div>
          </div>
        </div>

        {/* Comment Input */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm">
          <div className="flex gap-3">
            <Input
              placeholder="Add an anonymous comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-1 border-none bg-transparent focus:ring-0"
              onKeyPress={(e) => e.key === 'Enter' && handleSubmitComment()}
            />
            <Button
              onClick={handleSubmitComment}
              disabled={!commentText.trim()}
              size="icon"
              className="rounded-full bg-gradient-primary shadow-bubble hover:shadow-bubble-glow disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Comments */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">
            Comments ({comments.length})
          </h3>
          
          {comments.map((comment, index) => (
            <div
              key={comment.id}
              className="relative animate-bubble-pop"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 shadow-sm">
                <p className="text-foreground text-sm leading-relaxed mb-3">
                  {comment.text}
                </p>
                <div className="flex items-center justify-between text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-foreground p-0 h-auto"
                    >
                      <Heart className="h-3 w-3 mr-1" />
                      <span className="text-xs">{comment.likes}</span>
                    </Button>
                  </div>
                  <span className="text-xs">{comment.timeAgo}</span>
                </div>
              </div>
            </div>
          ))}

          {comments.length === 0 && (
            <div className="text-center py-8">
              <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No comments yet. Be the first to respond!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetail;