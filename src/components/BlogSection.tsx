import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, FileText, Play, Eye, Calendar } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { BlogPost } from '@/types';

interface BlogSectionProps {
  isOpen: boolean;
  onClose: () => void;
}

const BlogSection: React.FC<BlogSectionProps> = ({ isOpen, onClose }) => {
  const { blogPosts, incrementBlogViews } = useAppContext();
  const [selected, setSelected] = useState<BlogPost | null>(null);
  const [filter, setFilter] = useState<'all' | 'article' | 'video'>('all');

  if (!isOpen) return null;

  const filtered = filter === 'all' ? blogPosts : blogPosts.filter(p => p.type === filter);

  const openPost = (post: BlogPost) => {
    incrementBlogViews(post.id);
    setSelected(post);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[55] flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white w-full max-w-5xl max-h-[95vh] overflow-hidden rounded-2xl shadow-2xl flex flex-col">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 sm:p-6 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold">JonzyAutomobile Blog</h2>
            <p className="text-xs sm:text-sm text-indigo-100">Articles, guides & video content</p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => { setSelected(null); onClose(); }} className="text-white hover:bg-white/20">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {!selected ? (
          <>
            <div className="flex gap-2 p-4 border-b bg-slate-50 flex-wrap">
              {(['all', 'article', 'video'] as const).map(f => (
                <Button key={f} size="sm" variant={filter === f ? 'default' : 'outline'}
                  onClick={() => setFilter(f)} className="capitalize h-9">
                  {f === 'all' ? 'All' : f + 's'}
                </Button>
              ))}
              <span className="ml-auto text-xs sm:text-sm text-slate-500 self-center">{filtered.length} posts</span>
            </div>

            <div className="overflow-y-auto p-4 sm:p-6 flex-1">
              {filtered.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No posts yet. Check back soon!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filtered.map(post => (
                    <div key={post.id} onClick={() => openPost(post)}
                      className="cursor-pointer bg-white border rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all">
                      <div className="relative aspect-video bg-slate-100">
                        {post.thumbnail ? (
                          <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover" loading="lazy" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100">
                            {post.type === 'video' ? <Play className="w-12 h-12 text-indigo-400" /> : <FileText className="w-12 h-12 text-indigo-400" />}
                          </div>
                        )}
                        {post.type === 'video' && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <div className="bg-white/90 rounded-full p-3">
                              <Play className="w-6 h-6 text-indigo-600 fill-indigo-600" />
                            </div>
                          </div>
                        )}
                        <Badge className="absolute top-2 left-2 capitalize">{post.type}</Badge>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-base line-clamp-2 mb-2">{post.title}</h3>
                        <p className="text-xs text-slate-500 line-clamp-2 mb-3">{post.content}</p>
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(post.createdAt).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {post.views}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="overflow-y-auto p-4 sm:p-6 flex-1">
            <Button variant="outline" size="sm" onClick={() => setSelected(null)} className="mb-4">← Back to blog</Button>
            <article className="max-w-3xl mx-auto">
              <Badge className="mb-3 capitalize">{selected.type}</Badge>
              <h1 className="text-2xl sm:text-3xl font-bold mb-3">{selected.title}</h1>
              <div className="flex items-center gap-4 text-sm text-slate-500 mb-6">
                <span>By {selected.author}</span>
                <span>{new Date(selected.createdAt).toLocaleDateString()}</span>
                <span className="flex items-center gap-1"><Eye className="w-4 h-4" />{selected.views} views</span>
              </div>

              {selected.type === 'video' && selected.mediaUrl ? (
                <video src={selected.mediaUrl} controls className="w-full rounded-xl mb-6 bg-black" />
              ) : selected.thumbnail ? (
                <img src={selected.thumbnail} alt={selected.title} className="w-full rounded-xl mb-6" />
              ) : null}

              <div className="prose max-w-none whitespace-pre-wrap text-slate-700 leading-relaxed">
                {selected.content}
              </div>
            </article>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogSection;
