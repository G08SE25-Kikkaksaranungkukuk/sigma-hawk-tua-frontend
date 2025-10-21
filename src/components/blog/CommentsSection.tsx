import { useState } from 'react';
import { Heart, MessageCircle, Send } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { motion, AnimatePresence } from 'framer-motion';

interface Comment {
  id: number;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  timestamp: string;
  likes: number;
  replies?: Comment[];
}

interface CommentsSectionProps {
  comments: Comment[];
}

function CommentCard({ comment, depth = 0 }: { comment: Comment; depth?: number }) {
  const [liked, setLiked] = useState(false);
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [localLikes, setLocalLikes] = useState(comment.likes);

  const handleLike = () => {
    setLiked(!liked);
    setLocalLikes(liked ? localLikes - 1 : localLikes + 1);
  };

  const handleReply = () => {
    if (replyText.trim()) {
      // In a real app, this would post to a backend
      setReplyText('');
      setShowReply(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={`${depth > 0 ? 'ml-12 mt-4' : 'mt-6'}`}
    >
      <div className="flex gap-4">
        <Avatar className="w-10 h-10 border-2 border-border flex-shrink-0">
          <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
          <AvatarFallback>
            {comment.author.name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="bg-muted/50 rounded-2xl px-4 py-3 backdrop-blur-sm border border-border/50">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium">{comment.author.name}</span>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
            </div>
            <p className="text-sm text-foreground/90 leading-relaxed">{comment.content}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 mt-2 ml-2">
            <button
              onClick={handleLike}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-red-500 transition-colors group"
            >
              <Heart
                className={`w-4 h-4 transition-all ${
                  liked ? 'fill-red-500 text-red-500 scale-110' : 'group-hover:scale-110'
                }`}
              />
              <span className={liked ? 'text-red-500' : ''}>{localLikes}</span>
            </button>
            <button
              onClick={() => setShowReply(!showReply)}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Reply</span>
            </button>
          </div>

          {/* Reply Input */}
          <AnimatePresence>
            {showReply && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-3 overflow-hidden"
              >
                <div className="flex gap-2">
                  <Textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write a reply..."
                    className="min-h-[80px] resize-none"
                  />
                  <Button
                    onClick={handleReply}
                    size="icon"
                    className="flex-shrink-0"
                    disabled={!replyText.trim()}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Nested Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-2">
              {comment.replies.map((reply) => (
                <CommentCard key={reply.id} comment={reply} depth={depth + 1} />
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function CommentsSection({ comments }: CommentsSectionProps) {
  const [newComment, setNewComment] = useState('');
  const [localComments, setLocalComments] = useState(comments);

  const handlePostComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now(),
        author: {
          name: 'You',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
        },
        content: newComment,
        timestamp: 'Just now',
        likes: 0,
      };
      setLocalComments([comment, ...localComments]);
      setNewComment('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 border-t border-border mt-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl mb-8">
          Comments ({localComments.length})
        </h2>

        {/* New Comment Form */}
        <div className="mb-8">
          <div className="flex gap-4">
            <Avatar className="w-10 h-10 border-2 border-border flex-shrink-0">
              <AvatarImage
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400"
                alt="Your avatar"
              />
              <AvatarFallback>YO</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts about this article..."
                className="min-h-[100px] resize-none mb-3"
              />
              <div className="flex justify-end">
                <Button
                  onClick={handlePostComment}
                  disabled={!newComment.trim()}
                  className="gap-2"
                >
                  <Send className="w-4 h-4" />
                  Post Comment
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Comments List */}
        <div className="space-y-2">
          <AnimatePresence>
            {localComments.map((comment) => (
              <CommentCard key={comment.id} comment={comment} />
            ))}
          </AnimatePresence>
        </div>

        {localComments.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 text-muted-foreground"
          >
            <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No comments yet. Be the first to share your thoughts!</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}