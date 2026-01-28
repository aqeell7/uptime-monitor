import cron from 'node-cron';
import Monitor from '../models/Monitor.js';
import { checkUrl } from '../utils/uptimeHandler.js';
import sendNotification from '../utils/sendEmail.js';
import Incident from '../models/Incident.js';
import { ioInstance } from '../index.js';

const startMonitor = () => {
  cron.schedule("*/15 * * * * *", async () => {
    console.log("Running monitor checks...");

    try {
      const monitors = await Monitor.find({}).populate('user');

      for (const monitor of monitors) {
        const newStatus = await checkUrl(monitor.url);

        if (newStatus !== monitor.status) {
          
          const isRelevantEvent = monitor.status !== 'PENDING' || newStatus === 'DOWN';

          if (isRelevantEvent) {   
            const incident = await Incident.create({
              monitor: monitor._id,
              user: monitor.user._id,
              status: newStatus,
              timestamp: new Date()
            });         

            await sendNotification(
              monitor.user.email,
              monitor.name,
              monitor.url,
              newStatus
            );

            if (ioInstance) {
              ioInstance.to(monitor.user._id.toString()).emit('incident_new', {
                  _id: incident._id,
                  status: incident.status,
                  timestamp: incident.timestamp,
                  monitor: {
                      name: monitor.name,
                      url: monitor.url
                  }
              });
          } 
          }

          monitor.status = newStatus;
        }

        if (ioInstance) {
          ioInstance
            .to(monitor.user._id.toString())
            .emit('monitor_update', {
              monitorId: monitor._id,
              status: newStatus,
              lastCheckedAt: new Date(),
              url: monitor.url
            });
        }   

        monitor.lastCheckedAt = new Date(); 
        await monitor.save();
      }
    } catch (error) {
      console.error('Monitor cron job failed:', error);
    }
  });
};

export default startMonitor;