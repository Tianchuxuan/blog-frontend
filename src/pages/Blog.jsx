import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../api/axios';
import BlogPostCard from '../components/BlogPostCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import PageWrapper from '../components/PageWrapper';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await api.get('/blog?limit=100'); // 获取所有文章，或者实现分页UI
        setPosts(response.data.posts || response.data); // 兼容新旧格式
        setError('');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load blog posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <PageWrapper>
      <div>
        <h1 className="text-3xl font-bold mb-8">Blog</h1>
        {posts.length === 0 ? (
          <p className="text-gray-600">No blog posts found.</p>
        ) : (
          <motion.div 
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {posts.map((post) => (
              <BlogPostCard key={post._id} post={post} />
            ))}
          </motion.div>
        )}
      </div>
    </PageWrapper>
  );
}
