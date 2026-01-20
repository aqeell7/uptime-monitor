import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import api from '../api/axios';
import { toast } from 'react-hot-toast';

const CreateMonitorModal = ({ isOpen, onClose, onSuccess }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  if (!isOpen) return null;

  const onSubmit = async (data) => {
    try {
      await api.post('/monitors', data);
      toast.success('Monitor created!');
      reset();
      onSuccess(); 
      onClose();   
    } catch (error) {
      toast.error('Failed to create monitor');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-96 shadow-xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-xl font-bold mb-4">Add New Monitor</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input 
              {...register('name', { required: 'Name is required' })} 
              placeholder="e.g. My Portfolio"
              className="mt-1 block w-full border rounded-md p-2"
            />
            {errors.name && <span className="text-red-500 text-xs">{errors.name.message}</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">URL</label>
            <input 
              {...register('url', { 
                required: 'URL is required',
                pattern: {
                  value: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
                  message: "Please enter a valid URL"
                }
              })} 
              placeholder="https://google.com"
              className="mt-1 block w-full border rounded-md p-2"
            />
            {errors.url && <span className="text-red-500 text-xs">{errors.url.message}</span>}
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
            Create Monitor
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateMonitorModal;