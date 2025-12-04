import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, Timestamp } from 'firebase/firestore';

// Component to show time remaining until post expires
function TimeRemaining({ expiresAt }) {
  const [timeLeft, setTimeLeft] = useState('');
  
  useEffect(() => {
    if (!expiresAt) return;
    
    const updateTime = () => {
      const now = Date.now();
      const expires = expiresAt.toMillis ? expiresAt.toMillis() : (typeof expiresAt === 'number' ? expiresAt : new Date(expiresAt).getTime());
      const diff = expires - now;
      
      if (diff <= 0) {
        setTimeLeft('Expired');
        return;
      }
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      setTimeLeft(`${hours}h ${minutes}m left`);
    };
    
    updateTime();
    const interval = setInterval(updateTime, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, [expiresAt]);
  
  return timeLeft ? (
    <span className="text-xs text-gray-400 ml-2">⏱️ {timeLeft}</span>
  ) : null;
}

function Feed() {
  const navigate = useNavigate();
  const user = auth.currentUser;
  const [newPost, setNewPost] = useState('');
  const [posts, setPosts] = useState([]);
  const [isPosting, setIsPosting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const q = query(collection(db, 'posts'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      try {
        const newPosts = snapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          .filter(post => {
            // Filter out expired posts
            if (!post.expiresAt) return true; // Keep posts without expiration (old posts)
            
            // Handle Firestore Timestamp
            const expirationMs = post.expiresAt.toMillis ? post.expiresAt.toMillis() : post.expiresAt;
            return expirationMs > Date.now();
          });
        setPosts(newPosts);
        console.log('Posts loaded successfully:', newPosts.length);
      } catch (error) {
        console.error('Error loading posts:', error);
        setError('Error loading posts. Please try refreshing the page.');
      }
    }, (error) => {
      console.error('Error in posts subscription:', error);
      setError('Error connecting to the feed. Please check your connection.');
    });

    return () => unsubscribe();
  }, [user, navigate]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      setError('Error signing out. Please try again.');
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    setIsPosting(true);
    setError('');
    
    try {
      // Create expiration timestamp 24 hours from now using Firestore Timestamp
      const expirationTime = Timestamp.fromMillis(Date.now() + 24 * 60 * 60 * 1000);
      
      const postData = {
        content: newPost.trim(),
        authorId: user.uid,
        authorEmail: user.email,
        timestamp: serverTimestamp(),
        createdAt: new Date().toISOString(),
        expiresAt: expirationTime
      };
      
      await addDoc(collection(db, 'posts'), postData);
      setNewPost('');
      setError('');
    } catch (error) {
      console.error('Error creating post:', error);
      setError(error.message || 'Error creating post. Please try again.');
    } finally {
      setIsPosting(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-md fixed w-full top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
              RealTalk
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600 text-sm hidden sm:block">{user.email}</span>
              <button
                onClick={handleSignOut}
                className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 pt-20 pb-12">
        {/* Post Creation Card */}
        <div className="bg-white rounded-xl shadow-sm border border-purple-100 p-6 mb-8">
          <form onSubmit={handlePostSubmit}>
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Share your thoughts... (disappears in 24 hours)"
              className="w-full p-4 border border-purple-100 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-gray-700 placeholder-gray-400"
              rows="3"
            />
            <div className="mt-4 flex justify-end">
              <button
                type="submit"
                disabled={isPosting || !newPost.trim()}
                className={`px-6 py-2 rounded-lg text-white font-medium transition-all ${
                  isPosting || !newPost.trim()
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-blue-500 hover:opacity-90'
                }`}
              >
                {isPosting ? 'Posting...' : 'Post'}
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
        </div>

        {/* Posts Feed */}
        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-xl shadow-sm border border-purple-100 p-6 transition-all hover:shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center text-white font-semibold text-lg">
                  {post.authorEmail[0].toUpperCase()}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{post.authorEmail}</p>
                  <p className="text-xs text-gray-500">
                    {post.timestamp?.toDate()?.toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                    <TimeRemaining expiresAt={post.expiresAt} />
                  </p>
                </div>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
            </div>
          ))}
          {posts.length === 0 && !error && (
            <div className="bg-white rounded-xl shadow-sm border border-purple-100 p-8 text-center">
              <p className="text-gray-500 text-lg">No posts yet. Be the first to share your thoughts!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Feed;
