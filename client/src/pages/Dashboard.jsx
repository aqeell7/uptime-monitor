import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../api/axios';
import { Plus, Globe, Clock, CheckCircle, XCircle ,AlertCircle, Trash2} from 'lucide-react';
import CreateMonitorModal from '../components/createMonitorModal';
import { formatDistanceToNow } from 'date-fns'
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [monitors, setMonitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [incidents, setIncidents] = useState([])

  const fetchMonitors = async () => {
    try {
      const monitorsRes = await api.get('/monitors');
      const incidentsRes = await api.get('/monitors/incidents'); 
      
      setMonitors(monitorsRes.data);
      setIncidents(incidentsRes.data);
    } catch (error) {
      console.error(error);
     
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMonitors();

    const interval = setInterval(()=>{
      fetchMonitors()
    },2000)

    return ()=> clearInterval(interval);
  }, []);

  const handleDelete = async (id) => {
    if(!window.confirm('Are you sure you want to delete this '))return

    try{
      await api.delete(`/monitors/${id}`);
      toast.success('Monitor delted')
      fetchMonitors()
    }catch(error){
      toast.error('Could not delete monitor')
    }
  }

  const getStatusBadge = (status)=>{
    const styles = {
      UP: 'bg-green-100 text-green-800',
      DOWN: 'bg-red-100 text-red-800',
      PENDING: 'bg-yellow-100 text-yellow-800'
    }

    const icons = {
      UP: <CheckCircle className="h-3 w-3 mr-1"/>,
      DOWN: <XCircle className="h-3 w-3 mr-1"/>,
      PENDING: <AlertCircle className="h-3 w-3 mr-1"/>
    };

     return (
        <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${styles[status] || styles.PENDING}`}>
            {icons[status] || icons.PENDING}
            {status}
        </div>
    );
    }

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

       
        {loading && monitors.length === 0 ? (
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

                        <div className='flex items-center space-x-2'></div>
                        {getStatusBadge(monitor.status)}
                         <button onClick={()=> handleDelete(monitor._id)}
                         className='text-gray-400 hover:text-red-500 transition'>
                          <Trash2 className='h-4 w-4'/>
                         </button>
                       
                    </div>

                    <div className="mt-4 pt-4 border-t flex items-center text-xs text-gray-400">
                    <Clock className="h-3 w-3 mr-1" />
                    {monitor.lastCheckedAt 
                        ? `Checked ${formatDistanceToNow(new Date(monitor.lastCheckedAt))} ago`
                        : 'Waiting for check...'}
                </div>
                </div>
                ))
            )}
          </div>
        )}

                  <div className="mt-12 bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-bold text-gray-800">Recent Incident History</h3>
            </div>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monitor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {incidents.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">No recent incidents recorded.</td>
                  </tr>
                ) : (
                  incidents.map((incident) => (
                    <tr key={incident._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {incident.monitor?.name || 'Deleted Monitor'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          incident.status === 'DOWN' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {incident.status === 'DOWN' ? 'WENT DOWN' : 'RECOVERED'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(incident.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
 
      </main>
    </div>
  );
};

export default Dashboard;