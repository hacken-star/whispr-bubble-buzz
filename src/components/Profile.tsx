import { useState } from "react";
import { User, Edit3, Shield, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Profile = () => {
  const [nickname, setNickname] = useState("Anonymous Student");
  const [isEditing, setIsEditing] = useState(false);

  const handleSaveNickname = () => {
    setIsEditing(false);
    // Save to localStorage for persistence
    localStorage.setItem("whispr-nickname", nickname);
  };

  return (
    <div className="min-h-screen bg-gradient-map p-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">Profile</h1>
        <p className="text-muted-foreground">Manage your anonymous identity</p>
      </div>

      <div className="space-y-6">
        {/* Anonymous Identity Card */}
        <Card className="bg-white/80 backdrop-blur-sm border-none shadow-bubble">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Your Anonymous Identity</h3>
                <p className="text-sm text-muted-foreground">This name is only visible to you</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isEditing ? (
                <div className="flex gap-2">
                  <Input
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="Enter your nickname"
                    className="flex-1"
                    maxLength={30}
                  />
                  <Button onClick={handleSaveNickname} className="bg-gradient-primary">
                    Save
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">{nickname}</p>
                    <p className="text-sm text-muted-foreground">Private nickname</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setIsEditing(true)}
                    className="rounded-full"
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Privacy Info */}
        <Card className="bg-white/80 backdrop-blur-sm border-none shadow-bubble">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-whispr-teal" />
              Privacy & Anonymity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-whispr-teal mt-2"></div>
              <div>
                <p className="font-medium text-sm">Complete Anonymity</p>
                <p className="text-xs text-muted-foreground">Your posts and comments cannot be traced back to you</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-whispr-purple mt-2"></div>
              <div>
                <p className="font-medium text-sm">No Account Required</p>
                <p className="text-xs text-muted-foreground">No email, phone number, or personal information needed</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-whispr-pink mt-2"></div>
              <div>
                <p className="font-medium text-sm">Auto-Delete Posts</p>
                <p className="text-xs text-muted-foreground">All posts automatically disappear after 7 days</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* App Info */}
        <Card className="bg-white/80 backdrop-blur-sm border-none shadow-bubble">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Info className="h-5 w-5 text-whispr-blue" />
              About Whispr
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Whispr is a safe space for students to share thoughts, ask questions, and connect with their campus community anonymously.
            </p>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-whispr-teal/10 rounded-xl p-3">
                <p className="text-lg font-bold text-whispr-teal">100%</p>
                <p className="text-xs text-muted-foreground">Anonymous</p>
              </div>
              <div className="bg-whispr-purple/10 rounded-xl p-3">
                <p className="text-lg font-bold text-whispr-purple">7 Days</p>
                <p className="text-xs text-muted-foreground">Auto-Delete</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Community Guidelines */}
        <Card className="bg-white/80 backdrop-blur-sm border-none shadow-bubble">
          <CardHeader>
            <CardTitle>Community Guidelines</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-whispr-teal">•</span>
                Be respectful and kind to fellow students
              </li>
              <li className="flex items-start gap-2">
                <span className="text-whispr-purple">•</span>
                No hate speech, bullying, or harassment
              </li>
              <li className="flex items-start gap-2">
                <span className="text-whispr-pink">•</span>
                Keep discussions campus-related and constructive
              </li>
              <li className="flex items-start gap-2">
                <span className="text-whispr-blue">•</span>
                Report inappropriate content to help keep our community safe
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;