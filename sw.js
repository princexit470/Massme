// sw.js - Background Notifications & PWA

self.addEventListener('install', (e) => { 
    self.skipWaiting(); 
});

self.addEventListener('activate', (e) => { 
    e.waitUntil(clients.claim()); 
});

// Background Push Notifications
self.addEventListener('push', (event) => {
    let data = { title: 'New Notification', body: 'You have a new message!' };
    try { 
        if (event.data) data = event.data.json(); 
    } catch(e) {
        console.log("Push data error: ", e);
    }
    
    const options = {
        body: data.body,
        icon: 'https://cdn-icons-png.flaticon.com/512/1041/1041916.png',
        badge: 'https://cdn-icons-png.flaticon.com/512/1041/1041916.png',
        vibrate: [200, 100, 200, 100, 200],
        data: { url: '/' },
        tag: 'xit-notification', // Ek jaisi notifications ko group karega
        renotify: true
    };
    
    event.waitUntil(self.registration.showNotification(data.title, options));
});

// Notification Click (Jab user notification par click kare)
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    // Agar notification me koi specific URL hai to wo khole, warna home page
    const targetUrl = event.notification.data && event.notification.data.url ? event.notification.data.url : '/';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
            // Agar app pehle se open hai to usko focus kare
            if (clientList.length > 0) {
                let client = clientList[0];
                for (let i = 0; i < clientList.length; i++) { 
                    if (clientList[i].focused) {
                        client = clientList[i]; 
                    }
                }
                return client.focus();
            }
            // Agar app open nahi hai to naya window khole
            return clients.openWindow(targetUrl);
        })
    );
});
