import { useEffect, useState, useContext } from 'react';
import Navbar from '../components/Navbar';
import api from '../api/axios';
import { Plus, Globe, Clock, CheckCircle, XCircle, AlertCircle, Trash2, Activity } from 'lucide-react';
import CreateMonitorModal from '../components/createMonitorModal';
import { formatDistanceToNow } from 'date-fns'
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';
import AuthContext from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useContext(AuthContext)

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

    const socketUrl = import.meta.env.MODE === 'production'
    ? 'https://monitor.aqeelahmed.co.in'
    : 'http://localhost:5000';
  
    const socket = io(socketUrl);

    if (user && user._id) {
      socket.emit('join_room', user._id);
    }

    socket.on('monitor_update', (data) => {
      setMonitors(currentMonitors =>
        currentMonitors.map(m =>
          m._id === data.monitorId
            ? { ...m, status: data.status, lastCheckedAt: data.lastCheckedAt, url: data.url }
            : m
        )
      );
    });

    socket.on('incident_new', (newIncident) => {
      setIncidents(currentIncidents => {
        const updatedList = [newIncident, ...currentIncidents];
        return updatedList.slice(0, 10);
      });
    });

    return () => {
      socket.disconnect();
      socket.off('monitor_update');
      socket.off('incident_new');
    };
  }, [user]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this monitor?')) return;

    try {
      await api.delete(`/monitors/${id}`);
      toast.success('Monitor deleted')
      fetchMonitors()
    } catch (error) {
      toast.error('Could not delete monitor')
    }
  }

  const getStatusBadge = (status) => {
    const styles = {
      UP: 'bg-green-50 text-green-700 border-green-200',
      DOWN: 'bg-red-50 text-red-700 border-red-200',
      PENDING: 'bg-orange-50 text-orange-700 border-orange-200'
    }

    const icons = {
      UP: <CheckCircle className="h-3.5 w-3.5 mr-1.5" />,
      DOWN: <XCircle className="h-3.5 w-3.5 mr-1.5" />,
      PENDING: <AlertCircle className="h-3.5 w-3.5 mr-1.5" />
    };

    return (
      <div className={`px-2.5 py-1 rounded-md border text-xs font-medium flex items-center ${styles[status] || styles.PENDING}`}>
        {icons[status] || icons.PENDING}
        {status}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-sans text-gray-900 selection:bg-terracotta selection:text-white">
      <Navbar />

      <CreateMonitorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchMonitors}
      />

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-10 border-b border-gray-200 pb-6">
          <div>
            <h1 className="text-4xl font-serif font-bold text-charcoal tracking-tight">Dashboard</h1>
            <p className="text-gray-500 mt-2 text-sm">Monitor the health and uptime of your critical services.</p>
          </div>
          <button
            className="mt-4 sm:mt-0 flex items-center justify-center bg-charcoal text-background px-5 py-2.5 rounded-lg font-medium transition-all shadow-sm hover:shadow active:scale-95"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Monitor
          </button>
        </div>

        {loading && monitors.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <Activity className="h-8 w-8 animate-pulse text-terracotta mb-4" />
            <p>Loading your monitors...</p>
          </div>
        ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {monitors.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-200 shadow-sm">
                <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-400">
                  <Globe className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-medium text-charcoal mb-1">No monitors yet</h3>
                <p className="text-gray-500 text-sm mb-6">Add your first endpoint to start tracking uptime.</p>
                <button
                  className="flex items-center text-terracotta font-medium hover:text-orange-800 transition-colors"
                  onClick={() => setIsModalOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-1" /> Add your first monitor
                </button>
              </div>
            ) : (
              monitors.map((monitor) => (
                <div key={monitor._id} className="group bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 relative overflow-hidden flex flex-col justify-between">
                  {/* Status Top Strip Component */}
                  <div className={`absolute top-0 left-0 w-full h-1 ${monitor.status === 'UP' ? 'bg-green-500' : monitor.status === 'DOWN' ? 'bg-red-500' : 'bg-orange-400'}`}></div>

                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-serif font-bold text-charcoal truncate pr-4">{monitor.name}</h3>
                      {getStatusBadge(monitor.status)}
                    </div>

                    <div className="flex items-center text-sm text-gray-500 mb-6 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                      <Globe className="h-4 w-4 mr-2 text-gray-400 shrink-0" />
                      <a href={monitor.url} target="_blank" rel="noreferrer" className="hover:text-terracotta truncate transition-colors">
                        {monitor.url}
                      </a>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
                    <div className="flex items-center text-xs text-gray-400 font-medium">
                      <Clock className="h-3.5 w-3.5 mr-1.5" />
                      {monitor.lastCheckedAt
                        ? `Checked ${formatDistanceToNow(new Date(monitor.lastCheckedAt))} ago`
                        : 'Waiting...'}
                    </div>
                    <button onClick={() => handleDelete(monitor._id)}
                      className='text-gray-300 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-md transition-colors opacity-0 group-hover:opacity-100'>
                      <Trash2 className='h-4 w-4' />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        <div className="mt-16 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 bg-gray-50/50">
            <h3 className="text-lg font-serif font-bold text-charcoal">Recent Incident History</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Monitor</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Event</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Time</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {incidents.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="px-6 py-8 text-center text-sm text-gray-500">
                      No recent incidents recorded. Everything is running smoothly.
                    </td>
                  </tr>
                ) : (
                  incidents.map((incident) => (
                    <tr key={incident._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {incident.monitor?.name || 'Deleted Monitor'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-medium rounded-md border ${incident.status === 'DOWN' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'
                          }`}>
                          {incident.status === 'DOWN' ? 'WENT DOWN' : 'RECOVERED'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(incident.timestamp).toLocaleString(undefined, {
                          dateStyle: 'medium',
                          timeStyle: 'short'
                        })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;