import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, User as UserIcon, ArrowRight } from 'lucide-react';

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4 }
  }
};

export default function BlogPostCard({ post }) {
  const { _id, title, content, author, createdAt } = post;

  return (
    <motion.article 
      className="group bg-white rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden"
      variants={cardVariants}
      whileHover={{ y: -8 }}
    >
      <div className="p-6">
        <Link to={`/blog/${_id}`}>
          <h3 className="text-2xl font-bold mb-3 text-gray-900 group-hover:text-primary-600 transition-colors leading-tight">
            {title}
          </h3>
        </Link>
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
          <span className="bg-gray-100 px-3 py-1 rounded-full font-medium flex items-center gap-1.5">
            <UserIcon size={14} />
            {author?.username || 'Unknown'}
          </span>
          <span className="text-gray-400">•</span>
          <time dateTime={createdAt} className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-1.5">
            <Calendar size={14} />
            {new Date(createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </time>
        </div>
        <p className="text-gray-600 mb-5 line-clamp-3 leading-relaxed">
          {content.substring(0, 200)}...
        </p>
        <Link
          to={`/blog/${_id}`}
          className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 font-semibold transition-all group"
        >
          Read More
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </motion.article>
  );
}
