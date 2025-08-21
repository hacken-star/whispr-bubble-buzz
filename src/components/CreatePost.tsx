import { useState } from "react";
import { ArrowLeft, Image, Send, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CreatePostProps {
  universityName: string;
  onBack: () => void;
  onSubmit: (text: string, image?: File) => void;
}

const CreatePost = ({ universityName, onBack, onSubmit }: CreatePostProps) => {
  const [text, setText] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!text.trim()) return;
    
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    onSubmit(text, image || undefined);
    setIsSubmitting(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

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
              <h1 className="text-xl font-bold text-foreground">Create Post</h1>
              <p className="text-sm text-muted-foreground">{universityName}</p>
            </div>
          </div>
          <Button 
            onClick={handleSubmit}
            disabled={!text.trim() || isSubmitting}
            className="rounded-full bg-gradient-primary text-white shadow-bubble hover:shadow-bubble-glow disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Anonymous Notice */}
        <Alert className="border-whispr-teal/20 bg-whispr-teal/10">
          <AlertCircle className="h-4 w-4 text-whispr-teal" />
          <AlertDescription className="text-whispr-teal">
            Your post will be completely anonymous. No one can trace it back to you.
          </AlertDescription>
        </Alert>

        {/* Post Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-bubble">
          <Textarea
            placeholder="What's happening on campus? Share anonymously..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[120px] border-none resize-none bg-transparent text-foreground placeholder:text-muted-foreground focus:ring-0 text-base leading-relaxed"
            maxLength={280}
          />
          
          {/* Character Count */}
          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload">
                <Button variant="ghost" size="sm" className="rounded-full" asChild>
                  <div className="cursor-pointer">
                    <Image className="h-4 w-4 mr-2" />
                    Add Image
                  </div>
                </Button>
              </label>
              
              {image && (
                <div className="text-xs text-whispr-teal bg-whispr-teal/10 px-2 py-1 rounded-full">
                  Image selected
                </div>
              )}
            </div>
            
            <span className={`text-xs ${text.length > 250 ? 'text-destructive' : 'text-muted-foreground'}`}>
              {text.length}/280
            </span>
          </div>
        </div>

        {/* Preview Bubble */}
        {text.trim() && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Preview</h3>
            <div className="relative">
              <div className="bg-gradient-bubble rounded-3xl p-6 shadow-bubble animate-bubble-pop">
                <div className="text-white mb-4">
                  <p className="text-sm leading-relaxed font-medium">{text}</p>
                </div>
                <div className="flex items-center justify-between text-white/80">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <span className="text-xs">❤️ 0</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs">💬 0</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs">👁️ 0</span>
                    </div>
                  </div>
                  <span className="text-xs">now</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Guidelines */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4">
          <h3 className="font-semibold text-foreground mb-2">Community Guidelines</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Be respectful and kind to your fellow students</li>
            <li>• No hate speech, bullying, or harassment</li>
            <li>• Keep it campus-related and constructive</li>
            <li>• Posts automatically disappear after 7 days</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;