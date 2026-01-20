import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../api/axios';
import { Plus, Globe, Clock, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import CreateMonitorModal from '../components/createMonitorModal';

const Dashboard = () => {
  const [monitors, setMonitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchMonitors = async () => {
    try {
      const { data } = await api.get('/monitors'); 
      setMonitors(data);
    } catch (error) {
      console.error(error);
     
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMonitors();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <CreateMonitorModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchMonitors} 
      />

      <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
       
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Monitors</h1>
          <button 
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Monitor
          </button>
        </div>

       
        {loading ? (
          <div className="text-center py-10">Loading your monitors...</div>
        ) : (
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {monitors.length === 0 ? (
                <div className="col-span-full text-center py-10 bg-white rounded-lg shadow">
                    <p className="text-gray-500">No monitors yet. Add one to get started!</p>
                </div>
            ) : (
                monitors.map((monitor) => (
                  <div key={monitor._id} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition border-l-4 border-transparent">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800">{monitor.name}</h3>
                            <div className="flex items-center text-gray-500 text-sm mt-1">
                                <Globe className="h-4 w-4 mr-1" />
                                <a href={monitor.url} target="_blank" rel="noreferrer" className="hover:underline truncate max-w-50">
                                    {monitor.url}
                                </a>
                            </div>
                        </div>
                        
                        <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${
                            monitor.status === 'UP' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                             {monitor.status === 'UP' ? <CheckCircle className="h-3 w-3 mr-1"/> : <XCircle className="h-3 w-3 mr-1"/>}
                             {monitor.status}
                        </div>
                    </div>

                    <div className="mt-4 pt-4 border-t flex items-center text-xs text-gray-400">
                        <Clock className="h-3 w-3 mr-1" />
                        Last Checked: {monitor.lastCheckedAt ? new Date(monitor.lastCheckedAt).toLocaleString() : 'Never'}
                    </div>
                  </div>
                ))
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;