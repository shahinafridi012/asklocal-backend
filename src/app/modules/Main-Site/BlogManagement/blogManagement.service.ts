import { Blog } from "./blog.Management.model";
import { IBlog } from "./blogManagement.interface";

const createBlog = async (payload: IBlog) => {
  const blog = await Blog.create(payload);
  return blog;
};

const getAllBlogs = async () => {
  const blogs = await Blog.find().sort({ createdAt: -1 });
  return blogs;
};

const getBlogById = async (id: string) => {
  const blog = await Blog.findById(id);
  return blog;
};

const updateBlog = async (id: string, payload: Partial<IBlog>) => {
  const updated = await Blog.findByIdAndUpdate(id, payload, { new: true });
  return updated;
};

const deleteBlog = async (id: string) => {
  await Blog.findByIdAndDelete(id);
  return { message: "Blog deleted successfully" };
};

export const BlogService = {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
};
