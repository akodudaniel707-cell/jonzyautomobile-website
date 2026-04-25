import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Plus, Upload, X, Video, Shield, CheckCircle, XCircle, Users, ShoppingBag, FileText, Send, LogOut, Play } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { toast } from '@/components/ui/use-toast';

interface MediaFile {
  id: string;
  type: 'image' | 'video';
  url: string;
  name: string;
}

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

type Tab = 'add' | 'manage' | 'orders' | 'customers' | 'blog' | 'marketing';

const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose }) => {
  const {
    currentUser, addProduct, products, updateProduct, deleteProduct,
    orders, customers, blogPosts, addBlogPost, deleteBlogPost,
    sendMarketingEmail, logoutAdmin, isAdminAuthenticated
  } = useAppContext();

  const [activeTab, setActiveTab] = useState<Tab>('add');
  const [formData, setFormData] = useState({
    title: '', description: '', price: '', category: '', location: '', condition: 'new' as 'new' | 'used'
  });
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Blog form
  const [blogForm, setBlogForm] = useState({ title: '', content: '', type: 'article' as 'article' | 'video' });
  const [blogMedia, setBlogMedia] = useState<{ url: string; isVideo: boolean } | null>(null);

  // Marketing
  const [marketing, setMarketing] = useState({ subject: '', message: '' });
  const [sendingMarketing, setSendingMarketing] = useState(false);

  const categories = ['Vehicles', 'Electronics', 'Apartments for rent', 'Houses for sale', 'Fashion', 'Home & Garden', 'Sports', 'Books', 'Services', 'Other'];

  if (!isOpen || !currentUser?.isAdmin || !isAdminAuthenticated) return null;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMediaUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    Array.from(files).forEach(file => {
      const isVideo = file.type.startsWith('video/');
      const isImage = file.type.startsWith('image/');
      if (!isVideo && !isImage) return;
      setMediaFiles(prev => [...prev, {
        id: Date.now().toString() + Math.random(),
        type: isVideo ? 'video' : 'image',
        url: URL.createObjectURL(file), name: file.name
      }]);
    });
  };

  const removeMedia = (id: string) => setMediaFiles(prev => prev.filter(f => f.id !== id));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.price || !formData.category) return;
    setIsUploading(true);
    setTimeout(() => {
      addProduct({
        title: formData.title, description: formData.description,
        price: parseFloat(formData.price), category: formData.category,
        location: formData.location, condition: formData.condition,
        images: mediaFiles.map(f => f.url),
        createdAt: new Date(), adminId: currentUser.id, isSold: false
      });
      setFormData({ title: '', description: '', price: '', category: '', location: '', condition: 'new' });
      setMediaFiles([]);
      setIsUploading(false);
      toast({ title: 'Product added!', description: 'Listing is now live' });
    }, 1000);
  };

  const handleBlogUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isVideo = file.type.startsWith('video/');
    setBlogMedia({ url: URL.createObjectURL(file), isVideo });
    if (isVideo) setBlogForm(prev => ({ ...prev, type: 'video' }));
  };

  const handleBlogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogForm.title || !blogForm.content) return;
    addBlogPost({
      title: blogForm.title,
      content: blogForm.content,
      type: blogForm.type,
      mediaUrl: blogMedia?.isVideo ? blogMedia.url : undefined,
      thumbnail: blogMedia && !blogMedia.isVideo ? blogMedia.url : blogMedia?.url,
      author: 'JonzyAutomobile'
    });
    setBlogForm({ title: '', content: '', type: 'article' });
    setBlogMedia(null);
    toast({ title: 'Blog post published!', description: 'Users can now read/watch it' });
  };

  const handleMarketing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!marketing.subject || !marketing.message) return;
    setSendingMarketing(true);
    try {
      await sendMarketingEmail(marketing.subject, marketing.message);
      toast({ title: 'Campaign sent!', description: `Reached ${customers.length} customers` });
      setMarketing({ subject: '', message: '' });
    } catch {
      toast({ title: 'Failed', description: 'Could not send campaign', variant: 'destructive' });
    }
    setSendingMarketing(false);
  };

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  const tabs: { id: Tab; label: string; icon: any; count?: number }[] = [
    { id: 'add', label: 'Add Product', icon: Plus },
    { id: 'manage', label: 'Products', icon: ShoppingBag, count: products.length },
    { id: 'orders', label: 'Orders', icon: ShoppingBag, count: orders.length },
    { id: 'customers', label: 'Customers', icon: Users, count: customers.length },
    { id: 'blog', label: 'Blog', icon: FileText, count: blogPosts.length },
    { id: 'marketing', label: 'Marketing', icon: Send }
  ];

  return (
    <div className="fixed inset-0 bg-black/60 z-[65] flex items-center justify-center p-2 sm:p-4">
      <Card className="w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col">
        <CardHeader className="bg-gradient-to-r from-slate-900 to-blue-900 text-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6" />
              <div>
                <CardTitle className="text-xl">Admin Dashboard</CardTitle>
                <p className="text-xs text-slate-300">₦{totalRevenue.toLocaleString()} revenue · {orders.length} orders</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => { logoutAdmin(); onClose(); }} className="text-white hover:bg-white/20" title="Logout">
                <LogOut className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
          <div className="flex gap-1 mt-4 overflow-x-auto pb-1">
            {tabs.map(t => {
              const Icon = t.icon;
              return (
                <Button key={t.id} size="sm" variant={activeTab === t.id ? 'secondary' : 'ghost'}
                  onClick={() => setActiveTab(t.id)}
                  className={`text-white whitespace-nowrap ${activeTab === t.id ? '' : 'hover:bg-white/20'}`}>
                  <Icon className="w-4 h-4 mr-1" />
                  {t.label}{t.count !== undefined && ` (${t.count})`}
                </Button>
              );
            })}
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-6 overflow-y-auto flex-1">
          {activeTab === 'add' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label>Title *</Label>
                  <Input value={formData.title} onChange={e => handleInputChange('title', e.target.value)} required />
                </div>
                <div>
                  <Label>Price (₦) *</Label>
                  <Input type="number" value={formData.price} onChange={e => handleInputChange('price', e.target.value)} required />
                </div>
              </div>
              <div>
                <Label>Description</Label>
                <Textarea value={formData.description} onChange={e => handleInputChange('description', e.target.value)} rows={3} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <Label>Category *</Label>
                  <Select value={formData.category} onValueChange={v => handleInputChange('category', v)}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>{categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Location</Label>
                  <Input value={formData.location} onChange={e => handleInputChange('location', e.target.value)} />
                </div>
                <div>
                  <Label>Condition</Label>
                  <Select value={formData.condition} onValueChange={v => handleInputChange('condition', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="used">Used</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Media ({mediaFiles.length})</Label>
                <div className="border-2 border-dashed rounded-lg p-4 text-center">
                  <input type="file" multiple accept="image/*,video/*" onChange={handleMediaUpload} className="hidden" id="m-up" />
                  <label htmlFor="m-up" className="cursor-pointer">
                    <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">Click to upload</p>
                  </label>
                </div>
                {mediaFiles.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {mediaFiles.map(f => (
                      <div key={f.id} className="relative aspect-square bg-gray-100 rounded overflow-hidden group">
                        {f.type === 'image' ? <img src={f.url} className="w-full h-full object-cover" /> :
                          <div className="w-full h-full flex items-center justify-center"><Video className="w-6 h-6 text-gray-400" /></div>}
                        <Button type="button" variant="destructive" size="sm"
                          className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                          onClick={() => removeMedia(f.id)}><X className="w-3 h-3" /></Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <Button type="submit" disabled={isUploading} className="w-full bg-blue-600 hover:bg-blue-700">
                {isUploading ? 'Uploading...' : 'Add Product'}
              </Button>
            </form>
          )}

          {activeTab === 'manage' && (
            <div className="space-y-2">
              {products.map(p => (
                <div key={p.id} className="border rounded-lg p-3 flex items-center gap-3 flex-wrap">
                  <img src={p.images[0] || '/placeholder.svg'} className="w-14 h-14 object-cover rounded" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate">{p.title}</h3>
                    <p className="text-xs text-slate-500">₦{p.price.toLocaleString()} · {p.category}</p>
                    <Badge variant={p.isSold ? 'destructive' : 'default'} className="text-xs mt-1">{p.isSold ? 'SOLD' : 'AVAILABLE'}</Badge>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant={p.isSold ? 'outline' : 'default'}
                      onClick={() => updateProduct(p.id, { isSold: !p.isSold })}
                      className={p.isSold ? '' : 'bg-green-600 hover:bg-green-700'}>
                      {p.isSold ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                    </Button>
                    <Button size="sm" variant="destructive"
                      onClick={() => confirm('Delete this product?') && deleteProduct(p.id)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-2">
              {orders.length === 0 ? <p className="text-center text-slate-500 py-8">No orders yet</p> :
                orders.map(o => (
                  <div key={o.id} className="border rounded-lg p-3">
                    <div className="flex justify-between items-start flex-wrap gap-2">
                      <div>
                        <h4 className="font-semibold text-sm">{o.id}</h4>
                        <p className="text-xs text-slate-600">{o.customerName} · {o.customerEmail}</p>
                        <p className="text-xs text-slate-500">{o.customerPhone} · {o.customerAddress}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-blue-600">₦{o.total.toLocaleString()}</p>
                        <Badge className="text-xs">{o.status}</Badge>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-slate-500">
                      {o.items.map(i => `${i.productTitle} ×${i.quantity}`).join(', ')}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">Ref: {o.paymentReference} · {new Date(o.createdAt).toLocaleString()}</div>
                  </div>
                ))
              }
            </div>
          )}

          {activeTab === 'customers' && (
            <div className="space-y-2">
              {customers.length === 0 ? <p className="text-center text-slate-500 py-8">No customers yet</p> :
                customers.map(c => (
                  <div key={c.id} className="border rounded-lg p-3 flex justify-between items-start flex-wrap gap-2">
                    <div>
                      <h4 className="font-semibold text-sm">{c.name}</h4>
                      <p className="text-xs text-slate-600">{c.email} · {c.phone}</p>
                      <p className="text-xs text-slate-500">{c.address}</p>
                    </div>
                    <div className="text-right text-xs">
                      <p className="font-bold text-green-600">₦{c.totalSpent.toLocaleString()}</p>
                      <p className="text-slate-500">{c.totalOrders} orders</p>
                      <p className="text-slate-400">Last: {new Date(c.lastPurchase).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))
              }
            </div>
          )}

          {activeTab === 'blog' && (
            <div className="space-y-4">
              <form onSubmit={handleBlogSubmit} className="border rounded-lg p-4 space-y-3 bg-slate-50">
                <h3 className="font-semibold">Create New Blog Post</h3>
                <Input placeholder="Title" value={blogForm.title}
                  onChange={e => setBlogForm({ ...blogForm, title: e.target.value })} required />
                <Textarea placeholder="Content / description" value={blogForm.content}
                  onChange={e => setBlogForm({ ...blogForm, content: e.target.value })} rows={4} required />
                <div className="flex gap-2 items-center flex-wrap">
                  <Select value={blogForm.type} onValueChange={(v: 'article' | 'video') => setBlogForm({ ...blogForm, type: v })}>
                    <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="article">Article</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                    </SelectContent>
                  </Select>
                  <input type="file" accept="image/*,video/*" onChange={handleBlogUpload} className="hidden" id="blog-up" />
                  <label htmlFor="blog-up" className="cursor-pointer">
                    <Button type="button" size="sm" variant="outline" asChild>
                      <span><Upload className="w-4 h-4 mr-1" /> Upload Media</span>
                    </Button>
                  </label>
                  {blogMedia && (
                    <span className="text-xs text-green-600 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Media attached
                    </span>
                  )}
                </div>
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">Publish Post</Button>
              </form>

              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Published Posts ({blogPosts.length})</h3>
                {blogPosts.map(p => (
                  <div key={p.id} className="border rounded-lg p-3 flex items-center gap-3">
                    <div className="w-16 h-16 bg-slate-100 rounded flex-shrink-0 overflow-hidden">
                      {p.thumbnail ? <img src={p.thumbnail} className="w-full h-full object-cover" /> :
                        p.type === 'video' ? <Play className="w-full h-full p-4 text-slate-400" /> :
                        <FileText className="w-full h-full p-4 text-slate-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{p.title}</p>
                      <p className="text-xs text-slate-500">{p.type} · {p.views} views</p>
                    </div>
                    <Button size="sm" variant="destructive"
                      onClick={() => confirm('Delete this post?') && deleteBlogPost(p.id)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'marketing' && (
            <form onSubmit={handleMarketing} className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
                <p className="font-semibold text-blue-900">Reach all {customers.length} past customers</p>
                <p className="text-xs text-blue-700 mt-1">Free automated campaign via built-in CRM. Also runs automatically every 7 days.</p>
              </div>
              <div>
                <Label>Subject</Label>
                <Input value={marketing.subject} onChange={e => setMarketing({ ...marketing, subject: e.target.value })}
                  placeholder="Special offer for our valued customers" required />
              </div>
              <div>
                <Label>Message</Label>
                <Textarea value={marketing.message} onChange={e => setMarketing({ ...marketing, message: e.target.value })}
                  rows={6} placeholder="Dear valued customer, we have exciting new arrivals..." required />
              </div>
              <Button type="submit" disabled={sendingMarketing || customers.length === 0}
                className="bg-green-600 hover:bg-green-700">
                <Send className="w-4 h-4 mr-2" />
                {sendingMarketing ? 'Sending...' : `Send to ${customers.length} customers`}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPanel;
