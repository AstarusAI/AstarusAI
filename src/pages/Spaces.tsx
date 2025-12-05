import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/motion";
import { Plus, Brain, Building2, User, ArrowRight, Mail, Users, X } from "lucide-react";
import { 
  getUserSpaces, 
  createSpace, 
  deleteSpace, 
  inviteToSpace, 
  getSpaceMembers, 
  removeMember,
  type Space,
  type SpaceMember 
} from "@/lib/spaceService";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://dhzzxfr41qjcz7-8000.proxy.runpod.net";

export default function Spaces() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [newSpaceName, setNewSpaceName] = useState("");
  const [newSpaceType, setNewSpaceType] = useState<"company" | "personal">("personal");
  const [newSpaceDescription, setNewSpaceDescription] = useState("");
  const [creating, setCreating] = useState(false);
  const [inviteOpen, setInviteOpen] = useState<string | null>(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviting, setInviting] = useState(false);
  const [spaceMembers, setSpaceMembers] = useState<Record<string, SpaceMember[]>>({});
  const [membersOpen, setMembersOpen] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate("/login");
      return;
    }
    loadSpaces();
  }, [isAuthenticated, user, navigate]);

  const loadSpaces = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const userSpaces = await getUserSpaces(user.id, user.email || '');
      setSpaces(userSpaces);
    } catch (error: any) {
      console.error("Failed to load spaces:", error);
      alert(error.message || "Failed to load spaces");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSpace = async () => {
    if (!newSpaceName.trim() || !user) return;

    setCreating(true);
    try {
      const newSpace = await createSpace(
        user.id,
        newSpaceName,
        newSpaceType,
        newSpaceDescription || undefined
      );

      setSpaces([newSpace, ...spaces]);
      setCreateOpen(false);
      setNewSpaceName("");
      setNewSpaceType("personal");
      setNewSpaceDescription("");
    } catch (error: any) {
      console.error("Failed to create space:", error);
      alert(error.message || "Failed to create space");
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteSpace = async (spaceId: string) => {
    if (!confirm("Are you sure you want to delete this space? This action cannot be undone.")) {
      return;
    }

    try {
      await deleteSpace(spaceId);
      setSpaces(spaces.filter(s => s.id !== spaceId));
    } catch (error: any) {
      console.error("Failed to delete space:", error);
      alert(error.message || "Failed to delete space");
    }
  };

  const handleInvite = async (spaceId: string) => {
    if (!inviteEmail.trim() || !user) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inviteEmail)) {
      alert("Please enter a valid email address");
      return;
    }

    setInviting(true);
    try {
      await inviteToSpace(spaceId, inviteEmail, user.id);
      alert(`Invitation sent to ${inviteEmail}`);
      setInviteEmail("");
      setInviteOpen(null);
      // Reload members if dialog is open
      if (membersOpen === spaceId) {
        loadSpaceMembers(spaceId);
      }
    } catch (error: any) {
      console.error("Failed to invite user:", error);
      alert(error.message || "Failed to invite user");
    } finally {
      setInviting(false);
    }
  };

  const loadSpaceMembers = async (spaceId: string) => {
    try {
      const members = await getSpaceMembers(spaceId);
      setSpaceMembers(prev => ({ ...prev, [spaceId]: members }));
    } catch (error: any) {
      console.error("Failed to load members:", error);
    }
  };

  const handleRemoveMember = async (memberId: string, spaceId: string) => {
    if (!confirm("Are you sure you want to remove this member?")) {
      return;
    }

    try {
      await removeMember(memberId);
      loadSpaceMembers(spaceId);
    } catch (error: any) {
      console.error("Failed to remove member:", error);
      alert(error.message || "Failed to remove member");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 px-4 py-20 bg-gradient-to-b from-black via-primary/5 to-black">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer(0.1)}
            className="space-y-8"
          >
            <motion.div variants={fadeInUp(0)} className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">Your Spaces</h1>
                <p className="text-white/70">Manage your AI brains and knowledge bases</p>
              </div>
              <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-primary hover:opacity-90 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Space
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass-dark glass-border border-white/20 text-white bg-black/90 !left-1/2 !top-1/2 !-translate-x-1/2 !-translate-y-1/2">
                  <DialogHeader>
                    <DialogTitle className="text-white">Create New Space</DialogTitle>
                    <DialogDescription className="text-white/70">
                      A space is a named brain with its own memory. Each space has a unique identifier.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        value={newSpaceName}
                        onChange={(e) => setNewSpaceName(e.target.value)}
                        placeholder="e.g., X Company Brain"
                        className="bg-white/5 border-white/20 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Type *</Label>
                      <RadioGroup value={newSpaceType} onValueChange={(v) => setNewSpaceType(v as "company" | "personal")}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="company" id="company" />
                          <Label htmlFor="company" className="flex items-center gap-2 cursor-pointer">
                            <Building2 className="w-4 h-4" />
                            Company
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="personal" id="personal" />
                          <Label htmlFor="personal" className="flex items-center gap-2 cursor-pointer">
                            <User className="w-4 h-4" />
                            Personal
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description (Optional)</Label>
                      <Textarea
                        id="description"
                        value={newSpaceDescription}
                        onChange={(e) => setNewSpaceDescription(e.target.value)}
                        placeholder="What is this space for?"
                        className="bg-white/5 border-white/20 text-white"
                        rows={3}
                      />
                    </div>
                    <Button
                      onClick={handleCreateSpace}
                      disabled={creating || !newSpaceName.trim()}
                      className="w-full bg-gradient-primary hover:opacity-90 text-white"
                    >
                      {creating ? "Creating..." : "Create Space"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </motion.div>

            {spaces.length === 0 ? (
              <motion.div variants={fadeInUp(0.1)}>
                <Card className="glass-dark glass-border border-white/20">
                  <CardContent className="py-12 text-center">
                    <Brain className="w-16 h-16 mx-auto mb-4 text-white/30" />
                    <h3 className="text-xl font-semibold text-white mb-2">No spaces yet</h3>
                    <p className="text-white/70 mb-6">Create your first space to get started</p>
                    <Button
                      onClick={() => setCreateOpen(true)}
                      className="bg-gradient-primary hover:opacity-90 text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Space
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                variants={fadeInUp(0.1)}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {spaces.map((space, index) => (
                  <motion.div
                    key={space.id}
                    variants={fadeInUp(0.1 + index * 0.05)}
                  >
                    <Card className="glass-dark glass-border border-white/20 hover:border-primary/50 transition-all cursor-pointer h-full">
                      <CardHeader>
                        <div className="flex items-start justify-between mb-2">
                          <CardTitle className="text-white">{space.name}</CardTitle>
                          {space.type === "company" ? (
                            <Building2 className="w-5 h-5 text-primary" />
                          ) : (
                            <User className="w-5 h-5 text-secondary" />
                          )}
                        </div>
                        <CardDescription className="text-white/70 capitalize">
                          {space.type} Space
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {space.description && (
                          <p className="text-sm text-white/60 mb-4">{space.description}</p>
                        )}
                        <div className="space-y-2">
                          <Button
                            onClick={() => navigate(`/spaces/${space.lut_name}`)}
                            className="w-full bg-gradient-primary hover:opacity-90 text-white"
                          >
                            Open
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                          {space.creator_id === user?.id && (
                            <>
                              <Button
                                onClick={() => {
                                  setMembersOpen(space.id);
                                  loadSpaceMembers(space.id);
                                }}
                                variant="outline"
                                className="w-full border-white/20 text-white hover:bg-white/10"
                              >
                                <Users className="w-4 h-4 mr-2" />
                                Members
                              </Button>
                              <Button
                                onClick={() => handleDeleteSpace(space.id)}
                                variant="outline"
                                className="w-full border-red-500/50 text-red-400 hover:bg-red-500/10"
                              >
                                <X className="w-4 h-4 mr-2" />
                                Delete
                              </Button>
                            </>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Members Dialog */}
      <Dialog open={membersOpen !== null} onOpenChange={(open) => !open && setMembersOpen(null)}>
        <DialogContent className="glass-dark glass-border border-white/20 text-white bg-black/90 !left-1/2 !top-1/2 !-translate-x-1/2 !-translate-y-1/2 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">Space Members</DialogTitle>
            <DialogDescription className="text-white/70">
              Manage members and invitations for this space
            </DialogDescription>
          </DialogHeader>
          {membersOpen && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter email to invite"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && inviteEmail.trim()) {
                      handleInvite(membersOpen);
                    }
                  }}
                  className="bg-white/5 border-white/20 text-white"
                />
                <Button
                  onClick={() => handleInvite(membersOpen)}
                  disabled={inviting || !inviteEmail.trim()}
                  className="bg-gradient-primary hover:opacity-90 text-white"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  {inviting ? "Inviting..." : "Invite"}
                </Button>
              </div>
              <div className="max-h-64 overflow-y-auto space-y-2">
                {spaceMembers[membersOpen]?.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{member.email}</p>
                        <p className="text-xs text-white/60 capitalize">
                          {member.role} • {member.status}
                        </p>
                      </div>
                    </div>
                    {spaces.find(s => s.id === membersOpen)?.creator_id === user?.id && 
                     member.role !== 'owner' && (
                      <Button
                        onClick={() => handleRemoveMember(member.id, membersOpen)}
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                {(!spaceMembers[membersOpen] || spaceMembers[membersOpen].length === 0) && (
                  <p className="text-center text-white/60 py-4">No members yet</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}

