import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
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
import { Plus, Brain, Building2, User, ArrowRight, Mail, Users, X, Check, XCircle, Users2, Edit2, Save } from "lucide-react";
import { 
  getUserSpaces, 
  createSpace, 
  deleteSpace, 
  updateSpace,
  inviteToSpace, 
  getSpaceMembers, 
  removeMember,
  getPendingInvitations,
  acceptInvitation,
  declineInvitation,
  type Space,
  type SpaceMember 
} from "@/lib/spaceService";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://dhzzxfr41qjcz7-8000.proxy.runpod.net";

export default function Spaces() {
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteOpen, setInviteOpen] = useState<string | null>(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviting, setInviting] = useState(false);
  const [spaceMembers, setSpaceMembers] = useState<Record<string, SpaceMember[]>>({});
  const [membersOpen, setMembersOpen] = useState<string | null>(null);
  const [pendingInvitations, setPendingInvitations] = useState<Array<SpaceMember & { space: Space }>>([]);
  const [processingInvitation, setProcessingInvitation] = useState<string | null>(null);
  const [editingSpaceId, setEditingSpaceId] = useState<string | null>(null);
  const [editSpaceName, setEditSpaceName] = useState("");
  const [updatingSpace, setUpdatingSpace] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated || !user) {
      navigate("/login");
      return;
    }
    loadSpaces();
    loadPendingInvitations();
  }, [authLoading, isAuthenticated, user, navigate]);

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

  const loadPendingInvitations = async () => {
    if (!user) return;
    
    try {
      const invitations = await getPendingInvitations(user.email || '');
      setPendingInvitations(invitations);
    } catch (error: any) {
      console.error("Failed to load invitations:", error);
    }
  };

  const handleAcceptInvitation = async (spaceId: string) => {
    if (!user) return;
    
    setProcessingInvitation(spaceId);
    try {
      await acceptInvitation(spaceId, user.id, user.email || '');
      // Reload spaces and invitations
      await loadSpaces();
      await loadPendingInvitations();
    } catch (error: any) {
      console.error("Failed to accept invitation:", error);
      alert(error.message || "Failed to accept invitation");
    } finally {
      setProcessingInvitation(null);
    }
  };

  const handleDeclineInvitation = async (spaceId: string) => {
    if (!user) return;
    
    setProcessingInvitation(spaceId);
    try {
      // Delete the invitation from database
      await declineInvitation(spaceId, user.email || '');
      // Remove from UI
      setPendingInvitations(prev => 
        prev.filter(inv => inv.space_id !== spaceId)
      );
    } catch (error: any) {
      console.error("Failed to decline invitation:", error);
      alert(error.message || "Failed to decline invitation");
    } finally {
      setProcessingInvitation(null);
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

  const handleStartEditSpace = (space: Space) => {
    setEditingSpaceId(space.id);
    setEditSpaceName(space.name);
  };

  const handleCancelEditSpace = () => {
    setEditingSpaceId(null);
    setEditSpaceName("");
  };

  const handleSaveSpaceName = async (spaceId: string) => {
    if (!editSpaceName.trim()) {
      alert("Space name cannot be empty");
      return;
    }

    setUpdatingSpace(true);
    try {
      await updateSpace(spaceId, { name: editSpaceName.trim() });
      // Update local state
      setSpaces(spaces.map(s => s.id === spaceId ? { ...s, name: editSpaceName.trim() } : s));
      setEditingSpaceId(null);
      setEditSpaceName("");
    } catch (error: any) {
      console.error("Failed to update space:", error);
      alert(error.message || "Failed to update space name");
    } finally {
      setUpdatingSpace(false);
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

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-4 pt-24 pb-10 bg-muted/20">
          <Card className="p-8 rounded-2xl border border-border shadow-sm bg-card max-w-sm w-full text-center">
            <div className="w-10 h-10 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm font-medium text-foreground">Loading spaces...</p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 relative px-3 sm:px-4 pt-20 sm:pt-24 md:pt-28 pb-8 sm:pb-12 md:pb-16 bg-gradient-to-b from-background via-muted/20 to-background overflow-hidden safe-area-px">
        <div className="absolute inset-0 bg-grid-subtle pointer-events-none" aria-hidden />
        <div className="container relative z-10 mx-auto max-w-6xl">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer(0.08, 0.05)}
            className="space-y-5 sm:space-y-6"
          >
            <motion.div variants={fadeInUp(0)} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-1">My Spaces</p>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">Your Spaces</h1>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Manage your AI brains and knowledge bases</p>
              </div>
              <Button
                className="w-full sm:w-auto min-h-[44px] rounded-xl bg-primary hover:bg-primary/90 text-white touch-manipulation font-semibold text-sm px-4 sm:px-5 py-2.5 shrink-0"
                onClick={() => navigate("/spaces/new")}
              >
                <Plus className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Create New Space</span>
                <span className="sm:hidden">Create</span>
              </Button>
            </motion.div>

            {/* Pending Invitations Section */}
            {pendingInvitations.length > 0 && (
              <motion.div variants={fadeInUp(0.05)} className="space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <Mail className="w-4 h-4 text-primary shrink-0" />
                  <h2 className="text-lg sm:text-xl font-bold text-foreground">Pending Invitations</h2>
                  <span className="px-2 py-0.5 rounded-full bg-primary/15 text-primary text-xs font-semibold border border-primary/20">
                    {pendingInvitations.length}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {pendingInvitations.map((invitation, index) => (
                    <motion.div key={invitation.id} variants={fadeInUp(0.08 + index * 0.03)}>
                      <Card className="bg-card border border-primary/30 hover:border-primary/50 transition-all shadow-sm rounded-xl overflow-hidden">
                        <CardHeader className="p-4 sm:p-5">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <CardTitle className="text-base sm:text-lg text-foreground truncate">{invitation.space.name}</CardTitle>
                            {invitation.space.icon ? (
                              <span className="text-xl sm:text-2xl shrink-0">{invitation.space.icon}</span>
                            ) : invitation.space.type === "team" ? (
                              <Users2 className="w-5 h-5 text-primary shrink-0" />
                            ) : (
                              <User className="w-5 h-5 text-secondary shrink-0" />
                            )}
                          </div>
                          <CardDescription className="text-xs sm:text-sm text-muted-foreground capitalize">
                            {invitation.space.type} • Invitation
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 sm:p-5 pt-0">
                          {invitation.space.description && (
                            <p className="text-xs sm:text-sm text-muted-foreground mb-3 line-clamp-2">{invitation.space.description}</p>
                          )}
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleAcceptInvitation(invitation.space_id)}
                              disabled={processingInvitation === invitation.space_id}
                              className="flex-1 min-h-[44px] rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-sm touch-manipulation"
                            >
                              <Check className="w-4 h-4 mr-1.5" />
                              {processingInvitation === invitation.space_id ? "..." : "Accept"}
                            </Button>
                            <Button
                              onClick={() => handleDeclineInvitation(invitation.space_id)}
                              disabled={processingInvitation === invitation.space_id}
                              variant="outline"
                              size="icon"
                              className="min-h-[44px] min-w-[44px] rounded-xl border-red-500/40 text-red-500 hover:bg-red-500/10 touch-manipulation shrink-0"
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Your Spaces Section */}
            <motion.div variants={fadeInUp(0.06)}>
              <div className="flex items-center gap-2 mb-3">
                <Brain className="w-4 h-4 text-primary shrink-0" />
                <h2 className="text-lg sm:text-xl font-bold text-foreground">Your Spaces</h2>
              </div>
            </motion.div>

            {spaces.length === 0 ? (
              <motion.div variants={fadeInUp(0.08)}>
                <Card className="bg-card border border-border shadow-sm rounded-xl overflow-hidden">
                  <CardContent className="py-10 sm:py-12 px-4 text-center">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 ring-2 ring-primary/15">
                      <Brain className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">No spaces yet</h3>
                    <p className="text-sm text-muted-foreground mb-5">Create your first space to get started</p>
                    <Button
                      onClick={() => navigate("/spaces/new")}
                      className="min-h-[44px] rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground touch-manipulation text-sm px-5"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Space
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                variants={fadeInUp(0.08)}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
              >
                {spaces.map((space, index) => (
                  <motion.div key={space.id} variants={fadeInUp(0.08 + index * 0.03)}>
                    <Card className="bg-card border border-border hover:border-primary/30 transition-all h-full shadow-sm rounded-xl overflow-hidden flex flex-col">
                      <CardHeader className="p-4 sm:p-5 pb-2">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 min-w-0">
                            {editingSpaceId === space.id ? (
                              <div className="flex items-center gap-2">
                                {space.icon && <span className="text-2xl flex-shrink-0">{space.icon}</span>}
                                <Input
                                  value={editSpaceName}
                                  onChange={(e) => setEditSpaceName(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      handleSaveSpaceName(space.id);
                                    } else if (e.key === "Escape") {
                                      handleCancelEditSpace();
                                    }
                                  }}
                                  className="bg-background border-border text-foreground flex-1 min-w-0 rounded-lg text-sm"
                                  autoFocus
                                  disabled={updatingSpace}
                                />
                                <Button
                                  size="sm"
                                  onClick={() => handleSaveSpaceName(space.id)}
                                  disabled={updatingSpace || !editSpaceName.trim()}
                                  className="bg-primary hover:bg-primary/90 text-primary-foreground h-8 px-2"
                                >
                                  <Save className="w-3 h-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={handleCancelEditSpace}
                                  disabled={updatingSpace}
                                  className="text-muted-foreground hover:text-foreground h-8 px-2"
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              </div>
                            ) : (
                              <CardTitle className="text-foreground flex items-center gap-2">
                                {space.icon && <span className="text-2xl">{space.icon}</span>}
                                <span className="truncate">{space.name}</span>
                                {space.creator_id === user?.id && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleStartEditSpace(space);
                                    }}
                                    className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground hover:bg-muted/60 ml-1"
                                  >
                                    <Edit2 className="w-3 h-3" />
                                  </Button>
                                )}
                              </CardTitle>
                            )}
                          </div>
                          {!space.icon && editingSpaceId !== space.id && (
                            space.type === "team" ? (
                              <Users2 className="w-5 h-5 text-primary flex-shrink-0" />
                            ) : (
                              <User className="w-5 h-5 text-secondary flex-shrink-0" />
                            )
                          )}
                        </div>
                        <CardDescription className="text-xs sm:text-sm text-muted-foreground capitalize">
                          {space.type} Space
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 sm:p-5 pt-0 flex-1 flex flex-col">
                        {space.description && (
                          <p className="text-xs sm:text-sm text-muted-foreground mb-3 line-clamp-2">{space.description}</p>
                        )}
                        <div className="space-y-2 mt-auto">
                          <Button
                            onClick={() => navigate(`/spaces/${space.lut_name}`)}
                            className="w-full min-h-[44px] rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-sm touch-manipulation"
                          >
                            Open
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                          {space.creator_id === user?.id && (
                            <div className="grid grid-cols-2 gap-2">
                              <Button
                                onClick={() => {
                                  setMembersOpen(space.id);
                                  loadSpaceMembers(space.id);
                                }}
                                variant="outline"
                                className="min-h-[44px] rounded-xl border-border text-foreground bg-muted/50 hover:bg-muted text-sm touch-manipulation"
                              >
                                <Users className="w-4 h-4 mr-1.5 sm:mr-2" />
                                Members
                              </Button>
                              <Button
                                onClick={() => handleDeleteSpace(space.id)}
                                variant="outline"
                                className="min-h-[44px] rounded-xl border-red-500/40 text-red-500 bg-red-500/5 hover:bg-red-500/10 text-sm touch-manipulation"
                              >
                                <X className="w-4 h-4 mr-1.5 sm:mr-2" />
                                Delete
                              </Button>
                            </div>
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
        <DialogContent className="bg-card border border-border rounded-2xl !left-1/2 !top-1/2 !-translate-x-1/2 !-translate-y-1/2 w-[calc(100%-2rem)] max-w-[95vw] sm:max-w-2xl mx-4 max-h-[85vh] overflow-y-auto shadow-2xl p-4 sm:p-6">
          <DialogHeader className="space-y-1.5">
            <DialogTitle className="text-lg sm:text-xl text-foreground">Space Members</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Manage members and invitations for this space
            </DialogDescription>
          </DialogHeader>
          {membersOpen && (
            <div className="space-y-4 min-w-0">
              <div className="flex flex-col sm:flex-row gap-2">
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
                  className="bg-background border-border text-foreground min-h-[44px] rounded-xl touch-manipulation flex-1 min-w-0 text-sm"
                />
                <Button
                  onClick={() => handleInvite(membersOpen)}
                  disabled={inviting || !inviteEmail.trim()}
                  className="min-h-[44px] rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground touch-manipulation flex-shrink-0 text-sm px-4"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  {inviting ? "Inviting..." : "Invite"}
                </Button>
              </div>
              <div className="space-y-2 min-h-0 overflow-y-auto max-h-[min(50vh,20rem)] pr-1 -mr-1">
                {spaceMembers[membersOpen]?.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between gap-2 p-3 rounded-xl bg-muted/40 border border-border min-w-0"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0 ring-2 ring-primary/20">
                        <User className="w-4 h-4 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{member.email}</p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {member.role} • {member.status}
                        </p>
                      </div>
                    </div>
                    {spaces.find(s => s.id === membersOpen)?.creator_id === user?.id && 
                     member.role !== 'owner' && (
                      <Button
                        onClick={() => handleRemoveMember(member.id, membersOpen)}
                        variant="ghost"
                        size="icon"
                        className="min-h-[44px] min-w-[44px] rounded-xl text-red-500 hover:text-red-400 hover:bg-red-500/10 flex-shrink-0 touch-manipulation"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                {(!spaceMembers[membersOpen] || spaceMembers[membersOpen].length === 0) && (
                  <p className="text-center text-sm text-muted-foreground py-6">No members yet</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

