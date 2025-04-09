import { api } from './base.api';

const deleteBlog = async (blogId: string): Promise<void> => {
    try {
        const response = await api.delete(`/blogs/${blogId}`);
        console.log('Blog deleted successfully:', response.data);
    } catch (error) {
        console.error('Error deleting blog:', error);
        throw error;
    }
};

export default deleteBlog;