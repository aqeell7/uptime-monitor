import cron from 'node-cron';
import Monitor from '../models/Monitor.js';
import { checkUrl } from '../utils/uptimeHandler.js';
import sendNotification from '../utils/sendEmail.js';
import Incident from '../models/Incident.js';

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
            await Incident.create({
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
          }

          monitor.status = newStatus;
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