// Events Section Functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeEventsSection();
});

function initializeEventsSection() {
    // Initialize scroll animations
    initializeScrollAnimations();
    
    // Add event listeners
    setupEventListeners();
}

function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };

    const eventObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, observerOptions);

    // Observe event cards
    const eventCards = document.querySelectorAll('.event-card');
    eventCards.forEach(card => {
        eventObserver.observe(card);
    });
}

function setupEventListeners() {
    // Add click tracking for join event button
    const joinButtons = document.querySelectorAll('.event-join-btn');
    joinButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            trackEventJoin();
            showNotification('Opening Google Meet...', 'info');
        });
    });
}

function setReminder() {
    // Create calendar event data
    const eventData = {
        title: 'The World is Shifting from Web2 to Web3',
        description: 'How do we make the leap when the public isn\'t ready? Join the Innovators of Honour Community discussion.',
        location: 'Google Meet: meet.google.com/cxx-ctxs-rqe',
        startDate: getNextThursdayAt9PM(),
        duration: 60 // minutes
    };
    
    // Show reminder options
    showReminderModal(eventData);
}

function getNextThursdayAt9PM() {
    const now = new Date();
    const thursday = new Date();
    
    // Find next Thursday
    const daysUntilThursday = (4 - now.getDay() + 7) % 7;
    if (daysUntilThursday === 0 && now.getHours() >= 21) {
        // If it's Thursday after 9 PM, get next Thursday
        thursday.setDate(now.getDate() + 7);
    } else {
        thursday.setDate(now.getDate() + daysUntilThursday);
    }
    
    // Set time to 9 PM
    thursday.setHours(21, 0, 0, 0);
    
    return thursday;
}

function showReminderModal(eventData) {
    const modal = document.createElement('div');
    modal.className = 'reminder-modal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeReminderModal()"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h3>Set Event Reminder</h3>
                <button class="close-btn" onclick="closeReminderModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <p>Choose how you'd like to be reminded about this event:</p>
                <div class="reminder-options">
                    <button class="reminder-option" onclick="addToGoogleCalendar('${encodeEventData(eventData)}')">
                        <i class="fab fa-google"></i>
                        <span>Add to Google Calendar</span>
                    </button>
                    <button class="reminder-option" onclick="addToOutlook('${encodeEventData(eventData)}')">
                        <i class="fab fa-microsoft"></i>
                        <span>Add to Outlook</span>
                    </button>
                    <button class="reminder-option" onclick="downloadICS('${encodeEventData(eventData)}')">
                        <i class="fas fa-download"></i>
                        <span>Download .ics file</span>
                    </button>
                    <button class="reminder-option" onclick="setBrowserReminder()">
                        <i class="fas fa-bell"></i>
                        <span>Browser Notification</span>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add styles
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    // Animate in
    setTimeout(() => {
        modal.querySelector('.modal-content').style.transform = 'scale(1)';
        modal.querySelector('.modal-content').style.opacity = '1';
    }, 10);
}

function closeReminderModal() {
    const modal = document.querySelector('.reminder-modal');
    if (modal) {
        modal.remove();
    }
}

function encodeEventData(eventData) {
    return btoa(JSON.stringify(eventData));
}

function decodeEventData(encodedData) {
    return JSON.parse(atob(encodedData));
}

function addToGoogleCalendar(encodedData) {
    const eventData = decodeEventData(encodedData);
    const startDate = new Date(eventData.startDate);
    const endDate = new Date(startDate.getTime() + eventData.duration * 60000);
    
    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventData.title)}&dates=${formatDateForGoogle(startDate)}/${formatDateForGoogle(endDate)}&details=${encodeURIComponent(eventData.description)}&location=${encodeURIComponent(eventData.location)}`;
    
    window.open(googleUrl, '_blank');
    closeReminderModal();
    showNotification('Opening Google Calendar...', 'success');
}

function addToOutlook(encodedData) {
    const eventData = decodeEventData(encodedData);
    const startDate = new Date(eventData.startDate);
    const endDate = new Date(startDate.getTime() + eventData.duration * 60000);
    
    const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(eventData.title)}&startdt=${startDate.toISOString()}&enddt=${endDate.toISOString()}&body=${encodeURIComponent(eventData.description)}&location=${encodeURIComponent(eventData.location)}`;
    
    window.open(outlookUrl, '_blank');
    closeReminderModal();
    showNotification('Opening Outlook Calendar...', 'success');
}

function downloadICS(encodedData) {
    const eventData = decodeEventData(encodedData);
    const startDate = new Date(eventData.startDate);
    const endDate = new Date(startDate.getTime() + eventData.duration * 60000);
    
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Innovators of Honour//Event//EN
BEGIN:VEVENT
UID:${Date.now()}@innovatorsofhonour.com
DTSTAMP:${formatDateForICS(new Date())}
DTSTART:${formatDateForICS(startDate)}
DTEND:${formatDateForICS(endDate)}
SUMMARY:${eventData.title}
DESCRIPTION:${eventData.description}
LOCATION:${eventData.location}
END:VEVENT
END:VCALENDAR`;
    
    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'web3-event.ics';
    a.click();
    URL.revokeObjectURL(url);
    
    closeReminderModal();
    showNotification('Calendar file downloaded!', 'success');
}

function setBrowserReminder() {
    if ('Notification' in window) {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                const eventDate = getNextThursdayAt9PM();
                const reminderTime = eventDate.getTime() - Date.now() - (15 * 60 * 1000); // 15 minutes before
                
                if (reminderTime > 0) {
                    setTimeout(() => {
                        new Notification('Event Reminder', {
                            body: 'The Web3 discussion starts in 15 minutes!',
                            icon: '/favicon.ico'
                        });
                    }, reminderTime);
                    
                    showNotification('Browser reminder set for 15 minutes before the event!', 'success');
                } else {
                    showNotification('Event is too soon for browser reminder', 'warning');
                }
            } else {
                showNotification('Please enable notifications to set browser reminders', 'warning');
            }
        });
    } else {
        showNotification('Browser notifications not supported', 'error');
    }
    
    closeReminderModal();
}

function formatDateForGoogle(date) {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

function formatDateForICS(date) {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

function trackEventJoin() {
    console.log('Event join tracked:', {
        event: 'Web3 Discussion',
        timestamp: new Date().toISOString(),
        source: 'homepage'
    });
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${getNotificationIcon(type)}"></i>
        <span>${message}</span>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: -400px;
        background: rgba(0, 0, 0, 0.9);
        color: #fff;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        border-left: 4px solid ${getNotificationColor(type)};
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        z-index: 11000;
        transition: all 0.3s ease;
        backdrop-filter: blur(20px);
        display: flex;
        align-items: center;
        gap: 10px;
        max-width: 350px;
        font-weight: 500;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.style.right = '20px', 100);
    setTimeout(() => {
        notification.style.right = '-400px';
        setTimeout(() => document.body.removeChild(notification), 300);
    }, 4000);
}

function getNotificationIcon(type) {
    switch(type) {
        case 'success': return 'check-circle';
        case 'error': return 'exclamation-circle';
        case 'warning': return 'exclamation-triangle';
        default: return 'info-circle';
    }
}

function getNotificationColor(type) {
    switch(type) {
        case 'success': return '#4CAF50';
        case 'error': return '#f44336';
        case 'warning': return '#ff9800';
        default: return '#FFD700';
    }
}

// Add modal styles to document
const modalStyles = `
<style>
.reminder-modal .modal-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(10px);
}

.reminder-modal .modal-content {
    background: linear-gradient(135deg, #1a1a1a, #000);
    border-radius: 20px;
    padding: 0;
    max-width: 500px;
    width: 90%;
    border: 1px solid rgba(255, 215, 0, 0.3);
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
    transform: scale(0.9);
    opacity: 0;
    transition: all 0.3s ease;
    position: relative;
    z-index: 1;
}

.reminder-modal .modal-header {
    padding: 2rem 2rem 1rem;
    border-bottom: 1px solid rgba(255, 215, 0, 0.2);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.reminder-modal .modal-header h3 {
    color: #FFD700;
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0;
}

.reminder-modal .close-btn {
    background: none;
    border: none;
    color: #999;
    font-size: 1.5rem;
    cursor: pointer;
    transition: color 0.3s;
}

.reminder-modal .close-btn:hover {
    color: #FFD700;
}

.reminder-modal .modal-body {
    padding: 2rem;
}

.reminder-modal .modal-body p {
    color: #ccc;
    margin-bottom: 1.5rem;
}

.reminder-options {
    display: grid;
    gap: 1rem;
}

.reminder-option {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 215, 0, 0.2);
    border-radius: 12px;
    padding: 1rem 1.5rem;
    color: #fff;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 1rem;
}

.reminder-option:hover {
    background: rgba(255, 215, 0, 0.1);
    border-color: #FFD700;
    transform: translateY(-2px);
}

.reminder-option i {
    font-size: 1.2rem;
    color: #FFD700;
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', modalStyles);