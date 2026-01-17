import cron from 'node-cron';
import Monitor from '../models/Monitor.js';
import { checkUrl } from '../utils/uptimeHandler.js';

const startMonitor = () => {

  cron.schedule("* * * * *", async () => {
    console.log("Running monitor checks...");

    try {
      const monitors = await Monitor.find({});

      for (const monitor of monitors) {
        const status = await checkUrl(monitor.url);

        // Update properties
        monitor.status = status;
        monitor.lastCheckedAt = new Date(); 

        await monitor.save();
      }
    } catch (error) {
      console.error('Monitor cron job failed:', error);
    }
  });
};

export default startMonitor;
