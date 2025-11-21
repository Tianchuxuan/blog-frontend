import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function Admin() {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('projects');
  const [projects, setProjects] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    imageUrl: '',
    repoUrl: '',
    liveUrl: '',
  });

  const [showBlogForm, setShowBlogForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [blogForm, setBlogForm] = useState({
    title: '',
    content: '',
  });

  useEffect(() => {
    if (activeTab === 'projects') {
      fetchProjects();
    } else if (activeTab === 'blogs') {
      fetchBlogs();
    }
  }, [activeTab]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await api.get('/projects?limit=100');
      setProjects(response.data.projects || response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleProjectFormChange = (e) => {
    setProjectForm({
      ...projectForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateProject = () => {
    setEditingProject(null);
    setProjectForm({
      title: '',
      description: '',
      imageUrl: '',
      repoUrl: '',
      liveUrl: '',
    });
    setShowProjectForm(true);
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setProjectForm({
      title: project.title,
      description: project.description,
      imageUrl: project.imageUrl || '',
      repoUrl: project.repoUrl || '',
      liveUrl: project.liveUrl || '',
    });
    setShowProjectForm(true);
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingProject) {
        await api.put(`/projects/${editingProject._id}`, projectForm);
      } else {
        await api.post('/projects', projectForm);
      }

      setShowProjectForm(false);
      fetchProjects();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save project');
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      await api.delete(`/projects/${id}`);
      fetchProjects();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete project');
    }
  };

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/blog?limit=100');
      setBlogs(response.data.posts || response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };

  const handleBlogFormChange = (e) => {
    setBlogForm({
      ...blogForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateBlog = () => {
    setEditingBlog(null);
    setBlogForm({
      title: '',
      content: '',
    });
    setShowBlogForm(true);
  };

  const handleEditBlog = (blog) => {
    setEditingBlog(blog);
    setBlogForm({
      title: blog.title,
      content: blog.content,
    });
    setShowBlogForm(true);
  };

  const handleBlogSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingBlog) {
        await api.put(`/blog/${editingBlog._id}`, blogForm);
      } else {
        await api.post('/blog', blogForm);
      }

      setShowBlogForm(false);
      fetchBlogs();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save blog post');
    }
  };

  const handleDeleteBlog = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog post?')) {
      return;
    }

    try {
      await api.delete(`/blog/${id}`);
      fetchBlogs();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete blog post');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="mb-6 border-b border-gray-200">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('projects')}
            className={`pb-2 px-4 ${
              activeTab === 'projects'
                ? 'border-b-2 border-blue-600 text-blue-600 font-semibold'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Projects
          </button>
          <button
            onClick={() => setActiveTab('blogs')}
            className={`pb-2 px-4 ${
              activeTab === 'blogs'
                ? 'border-b-2 border-blue-600 text-blue-600 font-semibold'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Blog Posts
          </button>
        </div>
      </div>

      {error && <ErrorMessage message={error} />}

      {activeTab === 'projects' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Manage Projects</h2>
            <button
              onClick={handleCreateProject}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              + New Project
            </button>
          </div>

          {showProjectForm && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-xl font-bold mb-4">
                {editingProject ? 'Edit Project' : 'Create New Project'}
              </h3>
              <form onSubmit={handleProjectSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={projectForm.title}
                    onChange={handleProjectFormChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={projectForm.description}
                    onChange={handleProjectFormChange}
                    required
                    rows="4"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Image URL
                  </label>
                  <input
                    type="url"
                    name="imageUrl"
                    value={projectForm.imageUrl}
                    onChange={handleProjectFormChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Repository URL
                  </label>
                  <input
                    type="url"
                    name="repoUrl"
                    value={projectForm.repoUrl}
                    onChange={handleProjectFormChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Live URL
                  </label>
                  <input
                    type="url"
                    name="liveUrl"
                    value={projectForm.liveUrl}
                    onChange={handleProjectFormChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    {editingProject ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowProjectForm(false)}
                    className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="text-left p-2 md:p-4 font-semibold text-sm md:text-base">Title</th>
                    <th className="text-left p-2 md:p-4 font-semibold text-sm md:text-base hidden md:table-cell">Description</th>
                    <th className="text-left p-2 md:p-4 font-semibold text-sm md:text-base">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="text-center p-8 text-gray-600">
                        No projects found. Create your first project!
                      </td>
                    </tr>
                  ) : (
                    projects.map((project) => {
                      const projectUserId = project.user?._id || project.user;
                      const currentUserId = user?._id || user?.id;
                      const isOwner = projectUserId === currentUserId;
                      
                      return (
                        <tr key={project._id} className="border-b hover:bg-gray-50">
                          <td className="p-2 md:p-4 font-medium text-sm md:text-base">{project.title}</td>
                          <td className="p-2 md:p-4 text-gray-600 hidden md:table-cell text-sm">
                            {project.description.substring(0, 100)}...
                          </td>
                          <td className="p-2 md:p-4">
                            {isOwner ? (
                              <div className="flex gap-1 md:gap-2">
                                <button
                                  onClick={() => handleEditProject(project)}
                                  className="bg-yellow-500 text-white px-2 md:px-3 py-1 rounded hover:bg-yellow-600 transition text-xs md:text-sm"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteProject(project._id)}
                                  className="bg-red-600 text-white px-2 md:px-3 py-1 rounded hover:bg-red-700 transition text-xs md:text-sm"
                                >
                                  Delete
                                </button>
                              </div>
                            ) : (
                              <span className="text-gray-400 text-xs md:text-sm">
                                (Not your project)
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'blogs' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Manage Blog Posts</h2>
            <button
              onClick={handleCreateBlog}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              + New Blog Post
            </button>
          </div>

          {showBlogForm && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-xl font-bold mb-4">
                {editingBlog ? 'Edit Blog Post' : 'Create New Blog Post'}
              </h3>
              <form onSubmit={handleBlogSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={blogForm.title}
                    onChange={handleBlogFormChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Content *
                  </label>
                  <textarea
                    name="content"
                    value={blogForm.content}
                    onChange={handleBlogFormChange}
                    required
                    rows="10"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    {editingBlog ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowBlogForm(false)}
                    className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="text-left p-2 md:p-4 font-semibold text-sm md:text-base">Title</th>
                    <th className="text-left p-2 md:p-4 font-semibold text-sm md:text-base hidden lg:table-cell">Content Preview</th>
                    <th className="text-left p-2 md:p-4 font-semibold text-sm md:text-base hidden sm:table-cell">Date</th>
                    <th className="text-left p-2 md:p-4 font-semibold text-sm md:text-base">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {blogs.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center p-8 text-gray-600">
                        No blog posts found. Create your first post!
                      </td>
                    </tr>
                  ) : (
                    blogs.map((blog) => {
                      const authorId = blog.author?._id || blog.author;
                      const userId = user?._id || user?.id;
                      const isAuthor = authorId === userId;
                      
                      return (
                        <tr key={blog._id} className="border-b hover:bg-gray-50">
                          <td className="p-2 md:p-4 font-medium text-sm md:text-base">{blog.title}</td>
                          <td className="p-2 md:p-4 text-gray-600 hidden lg:table-cell text-sm">
                            {blog.content.substring(0, 100)}...
                          </td>
                          <td className="p-2 md:p-4 text-gray-600 text-xs md:text-sm hidden sm:table-cell">
                            {new Date(blog.createdAt).toLocaleDateString()}
                          </td>
                          <td className="p-2 md:p-4">
                            {isAuthor ? (
                              <div className="flex gap-1 md:gap-2">
                                <button
                                  onClick={() => handleEditBlog(blog)}
                                  className="bg-yellow-500 text-white px-2 md:px-3 py-1 rounded hover:bg-yellow-600 transition text-xs md:text-sm"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteBlog(blog._id)}
                                  className="bg-red-600 text-white px-2 md:px-3 py-1 rounded hover:bg-red-700 transition text-xs md:text-sm"
                                >
                                  Delete
                                </button>
                              </div>
                            ) : (
                              <span className="text-gray-400 text-xs md:text-sm">
                                (Not your post)
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
