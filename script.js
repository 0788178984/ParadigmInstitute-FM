const API_KEY = "AIzaSyAAJ06nHdpAc3DdCoHXCrJ8_5izL8jO4bc"; // Replace with your API key
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const chatMessages = document.getElementById('chat-messages');

// Load showdown for markdown support
const converter = typeof showdown !== 'undefined' ? new showdown.Converter({
    simplifiedAutoLink: true,
    strikethrough: true,
    tables: true,
    tasklists: true,
    emoji: true
}) : null;

// Update institute-specific information
const instituteInfo = {
    courses: {
        diplomaCourses: [
            "Diploma in Journalism",
            "Diploma in Accountancy",
            "Diploma in Public Administration",
            "Diploma in Secretarial Studies",
            "Diploma in Business Management",
            "Diploma in Computer Applications"
        ],
        certificateCourses: [
            "Basic Computer Applications",
            "Professional Short Courses"
        ]
    },
    radioPrograms: {
        station: "Paradigm FM",
        website: "radio.paradigmkagadi.org",
        programs: [
            "Morning News Brief",
            "Community Hour",
            "Educational Programs",
            "Local Music & Culture"
        ]
    },
    contact: {
        phones: ["+256(0) 772990845", "+256(0) 777348121"],
        email: "info@paradigmkagadi.org",
        location: "Kagadi-Kibaale Road, P.O Box 36, Kagadi Uganda"
    }
};

function formatMessage(message) {
    // Handle code blocks
    message = message.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
    
    // Handle inline code
    message = message.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    // Simple URL detection
    message = message.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
    
    // Process markdown if showdown is available
    if (converter) {
        return converter.makeHtml(message);
    }
    
    // Convert line breaks to <br> tags
    return message.replace(/\n/g, '<br>');
}

function addMessage(message, isUser = false, timestamp = null) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
    
    // Special handling for welcome message
    if (!isUser && message.includes("Hello! I'm Creative Palms Institute AI assistant")) {
        messageDiv.className += ' welcome-message';
        messageDiv.textContent = message;
    } else {
        // Format the message and set as HTML
        const formattedMessage = isUser ? message : formatMessage(message);
        
        // Create message content container
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        if (isUser) {
            contentDiv.textContent = formattedMessage;
        } else {
            contentDiv.innerHTML = formattedMessage;
        }
        
        messageDiv.appendChild(contentDiv);
    }
    
    if (timestamp) {
        const timeSpan = document.createElement('span');
        timeSpan.className = 'timestamp';
        timeSpan.textContent = timestamp;
        messageDiv.appendChild(timeSpan);
    }
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Add animation class
    setTimeout(() => {
        messageDiv.classList.add('visible');
    }, 10);
}

function showTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'typing-indicator';
    indicator.innerHTML = `
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
    `;
    chatMessages.appendChild(indicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return indicator;
}

// Update the welcome message with detailed lists
const welcomeMessage = `<div class="title-header">WELCOME TO PARADIGM INSTITUTE & FM!</div>

I'm your AI Assistant, here to help you learn about Paradigm Institute of Business and Media Studies and Paradigm FM.

<div class="title-header">OUR PROGRAMS:</div>

1. 📚 DIPLOMA PROGRAMS (3 Years):
   • Diploma in Journalism & Media Studies
   • Diploma in Accountancy
   • Diploma in Public Administration
   • Diploma in Secretarial Studies
   • Diploma in Business Management
   • Diploma in Computer Applications

2. 📻 PARADIGM FM SERVICES:
   • Live Radio Broadcasting (radio.paradigmkagadi.org)
   • News and Current Affairs Programs
   • Educational and Development Programs
   • Community Outreach Programs
   • Local Music and Culture Shows
   • Public Announcements Service

<div class="title-header">HOW CAN I HELP YOU?</div>

1. 📋 Course Information
   • Program Details
   • Entry Requirements
   • Course Duration
   • Fee Structure

2. 📝 Admissions
   • Application Process
   • Required Documents
   • Registration Dates
   • Scholarship Options

3. 📻 Paradigm FM
   • Listen Live
   • Program Schedule
   • Submit Announcements
   • Advertising

4. 📍 Contact Us
   • Location: Kagadi-Kibaale Road
   • Phone: +256(0) 772990845
   • Email: info@paradigmkagadi.org

Type a number (1-4) or ask any question about our programs!`;

// Function to check if query is about the institute or FM
function isParadigmQuery(query) {
    const keywords = [
        "paradigm", "institute", "course", "program", "certificate", 
        "diploma", "admission", "register", "enroll", "radio",
        "fm", "kagadi", "fees", "duration", "study"
    ];
    
    return keywords.some(keyword => 
        query.toLowerCase().includes(keyword.toLowerCase())
    );
}

// Function to handle institute-specific queries
function handleParadigmQuery(query) {
    query = query.toLowerCase();
    
    // Location/Contact queries
    if (query.includes("location") || query.includes("where") || 
        query.includes("contact") || query.includes("phone")) {
        return `You can find us at:
${instituteInfo.contact.location}

Contact us at:
📞 ${instituteInfo.contact.phones.join(" or ")}
📧 ${instituteInfo.contact.email}`;
    }

    // Radio/FM queries
    if (query.includes("radio") || query.includes("fm")) {
        return `Paradigm FM - Your Community Voice!

🎙️ Listen live at: ${instituteInfo.radioPrograms.website}

Today's Programs:
${instituteInfo.radioPrograms.programs.map(prog => "• " + prog).join("\n")}

For program schedules or announcements, contact our studio.`;
    }

    // Course related queries
    if (query.includes("course") || query.includes("program")) {
        if (query.includes("diploma")) {
            return "Our Diploma Programs (3 years):\n- " +
                   instituteInfo.courses.diplomaCourses.join("\n- ");
        }
        if (query.includes("certificate")) {
            return "Our Certificate Programs:\n- " +
                   instituteInfo.courses.certificateCourses.join("\n- ");
        }
        return `We offer various programs:

1. Diploma Programs (3 years):
${instituteInfo.courses.diplomaCourses.map(course => "   • " + course).join("\n")}

2. Certificate Programs:
${instituteInfo.courses.certificateCourses.map(course => "   • " + course).join("\n")}

Which program would you like to know more about?`;
    }

    // Default response
    return `Welcome to Paradigm Institute & FM! 

We offer quality education and community radio services.
How can I assist you today?

1. Course Information
2. Admission Details
3. Paradigm FM
4. Contact Information`;
}

// Update the API response handler
async function callGeminiAPI(prompt) {
    // First check if it's a Paradigm-related query
    if (isParadigmQuery(prompt)) {
        return handleParadigmQuery(prompt);
    }

    // Identity questions
    const identityKeywords = [
        "who made you", "who created you", "who developed you",
        "what are you", "who are you", "what model are you"
    ];
    
    if (identityKeywords.some(keyword => prompt.toLowerCase().includes(keyword))) {
        return "I'm the Paradigm Institute & FM AI assistant, here to help you learn about our educational programs and radio services!";
    }

    // Continue with Gemini API call for general knowledge questions
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': API_KEY
        },
        body: JSON.stringify({
            contents: [{
                parts: [{
                    text: prompt
                }]
            }],
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 2048
            }
        })
    });

    if (response.ok) {
        const result = await response.json();
        let responseText = result.candidates[0].content.parts[0].text;
        return responseText
            .replace(/Gemini/g, "Lucky")
            .replace(/gemini/g, "Lucky")
            .replace(/Google/g, "Lucky")
            .replace(/google/g, "Lucky");
    } else {
        throw new Error(`API Error: ${response.status} - ${await response.text()}`);
    }
}

// =============== EmailJS Configuration ===============
// To troubleshoot:
// 1. Go to EmailJS dashboard: https://dashboard.emailjs.com/
// 2. Check if these keys match your dashboard:

// PUBLIC KEY (Get from: Account > API Keys)
// If wrong: Login to EmailJS > Click your name > API Keys
(function() {
    emailjs.init("YOUR_PUBLIC_KEY");
})();

// Update the sendNotification function with troubleshooting comments
async function sendNotification(userMessage) {
    try {
        const response = await emailjs.send(
            "YOUR_SERVICE_ID",
            "YOUR_TEMPLATE_ID",
            {
                to_name: "Admin",
                from_name: "Website Visitor",
                message: userMessage,
                reply_to: "info@paradigmkagadi.org",
                subject: "Paradigm Institute Inquiry"
            }
        );
        return response;
    } catch (error) {
        console.error("Email notification error:", error);
        throw error;
    }
}

// =============== Troubleshooting Steps ===============
// If emails are not working:
// 1. Open browser console (F12 or right-click > Inspect)
// 2. Send a test message
// 3. Look for console logs above
// 4. Verify these match your EmailJS dashboard:
//    - Public Key: OUWdr0kTs6aX5J2PW
//    - Service ID: service_wgq1nd8
//    - Template ID: template_rdijcqi
// 5. Check your EmailJS dashboard:
//    - Correct email address is set
//    - Service is active
//    - Template variables match the code

// Update your sendMessage function with debug logs
async function sendMessage() {
    const message = messageInput.value.trim();
    if (!message) return;

    console.log("=== Starting New Message Process ===");
    console.log("Message to send:", message);

    messageInput.value = '';
    messageInput.disabled = true;
    sendButton.disabled = true;

    const now = new Date();
    const timestamp = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
    }).replace(/\s/g, '').toLowerCase();
    
    addMessage(message, true, timestamp);
    const typingIndicator = showTypingIndicator();

    try {
        // Attempt to send email notification
        console.log("Attempting to send email notification...");
        await sendNotification(message);
        console.log("Email notification sent successfully!");

        // Rest of your code...
        const response = await callGeminiAPI(message);
        typingIndicator.remove();
        addMessage(response, false, timestamp);
    } catch (error) {
        console.error("=== Error in Message Process ===");
        console.error(error);
        typingIndicator.remove();
        addMessage(`Error: ${error.message}`, false, timestamp);
    } finally {
        messageInput.disabled = false;
        sendButton.disabled = false;
        messageInput.focus();
    }
}

// Add input event listener to enable/disable send button based on input
messageInput.addEventListener('input', () => {
    sendButton.disabled = messageInput.value.trim() === '';
});

sendButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

messageInput.focus();

// Add initial welcome message
window.addEventListener('load', () => {
    const now = new Date();
    const timestamp = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
    }).replace(/\s/g, '').toLowerCase();
    
    addMessage(welcomeMessage, false, timestamp);
});