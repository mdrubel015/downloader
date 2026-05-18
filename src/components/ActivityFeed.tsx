import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, MousePointer2, Clock } from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'download' | 'click';
  label: string;
  timestamp: any;
}

export default function ActivityFeed() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  useEffect(() => {
    // Listen to downloads
    const qDownloads = query(collection(db, 'downloads'), orderBy('timestamp', 'desc'), limit(5));
    const unsubscribeDownloads = onSnapshot(qDownloads, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        type: 'download' as const,
        label: `New Download: ${doc.data().platform || 'Video'}`,
        timestamp: doc.data().timestamp,
      }));
      updateActivities(docs);
    });

    // Listen to ad clicks
    const qClicks = query(collection(db, 'ad_clicks'), orderBy('timestamp', 'desc'), limit(5));
    const unsubscribeClicks = onSnapshot(qClicks, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        type: 'click' as const,
        label: `Ad Clicked: ${doc.data().adId}`,
        timestamp: doc.data().timestamp,
      }));
      updateActivities(docs);
    });

    return () => {
      unsubscribeDownloads();
      unsubscribeClicks();
    };
  }, []);

  const updateActivities = (newItems: ActivityItem[]) => {
    setActivities(prev => {
      const combined = [...prev, ...newItems]
        .filter((item, index, self) => self.findIndex(t => t.id === item.id) === index)
        .sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0))
        .slice(0, 10);
      return combined;
    });
  };

  if (activities.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 hidden xl:block w-72">
      <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-widest text-orange-500 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
            Live Traffic
          </span>
          <Clock size={12} className="text-gray-600" />
        </div>
        <div className="p-2 space-y-1 max-h-64 overflow-y-auto scrollbar-hide">
          <AnimatePresence initial={false}>
            {activities.map((activity) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="p-3 bg-white/5 rounded-lg flex items-center gap-3 border border-white/5"
              >
                <div className={`p-1.5 rounded-md ${activity.type === 'download' ? 'bg-orange-500/20 text-orange-500' : 'bg-blue-500/20 text-blue-500'}`}>
                  {activity.type === 'download' ? <Zap size={14} /> : <MousePointer2 size={14} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-medium text-gray-200 truncate">{activity.label}</p>
                  <p className="text-[9px] text-gray-600 uppercase tracking-tighter">Just now</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
