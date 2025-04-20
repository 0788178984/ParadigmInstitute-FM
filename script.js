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

// Add institute-specific information
const instituteInfo = {
    courses: {
        nationalCertificate: [
            "Accounting and Finance",
            "Business Administration",
            "Records and Information Mgt",
            "Hotel and Institutional Catering",
            "Information & Computer Technology",
            "National Certificate in Tourism",
            "Nursery Teaching-ECD"
        ],
        nationalDiploma: [
            "National Diploma in Accountancy",
            "Hotel & Institutional Catering",
            "Business Administration",
            "Secretarial & Office Administration",
            "Records & Information Mgt",
            "Information & Computer Technology"
        ],
        shortCourses: [
            "Driving, Tourist guide",
            "Language at basic level",
            "NGO Management",
            "Financial management",
            "Public Admin & speaking",
            "Records management",
            "Soap and Shoe making"
        ],
        vocationalCourses: [
            "Pottery and Ceramics",
            "Tailoring and Garment cutting",
            "Fashion Design and knitting",
            "Hairdressing and Cosmetology",
            "Cookery and handcrafts",
            "Motor Vehicle mechanics",
            "Electrical installation"
        ]
    },
    admissionRequirements: [
        "Completed Primary Seven",
        "Completed Senior Four",
        "Completed Senior Six",
        "Dropouts welcome"
    ],
    contact: {
        phones: ["0702491818", "0792307623"],
        location: "in Fortportal City, Opposite Kitumba Mosque"
    },
    registration: {
        intake: "2025 April Intake",
        status: "Registration is ongoing"
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
    if (!isUser && message.includes("Hello! I'm Paradigm Institute & FM AI assistant")) {
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

// Function to check if query is about the institute
function isInstituteQuery(query) {
    const instituteKeywords = [
        "paradigm", "course", "program", "certificate", "diploma",
        "admission", "register", "enroll", "intake", "location", "contact",
        "kagadi", "requirements", "fees", "duration", "study", "radio", "fm",
        "paradigm fm", "paradigm institute", "paradigmkagadi"
    ];
    
    return instituteKeywords.some(keyword => 
        query.toLowerCase().includes(keyword.toLowerCase())
    );
}

// Function to get current intake information
function getCurrentIntakeInfo() {
    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
    return `${currentMonth} Intake`;
}

// Function to handle institute-specific queries
function handleInstituteQuery(query) {
    query = query.toLowerCase();
    
    // Radio service queries
    if (query.includes("radio") || query.includes("fm") || query.includes("paradigm fm")) {
        return `<div class="title-header">📻 PARADIGM FM 100.0 RADIO PROGRAMS</div>

<ul>
  <li><strong>Morning:</strong> Ekyererezi (5:00 am - 10:00 am)</li>
  <li><strong>Afternoon:</strong> Entuyo Zange (10:00 am - 2:00 pm)</li>
  <li><strong>Evening:</strong> Home Drive (2:00 pm - 6:00 pm)</li>
  <li><strong>Night:</strong> Evening Cruiz (6:00 pm - 9:00 pm)</li>
</ul>

<p>Listen to us online at: <a href="https://radio.paradigmkagadi.org" target="_blank">radio.paradigmkagadi.org</a></p>`;
    }
    
    // Location/Contact queries
    if (query.includes("location") || query.includes("where") || 
        query.includes("contact") || query.includes("phone")) {
        return `You can find us in Fortportal City, Opposite Kitumba Mosque\n` +
               `Contact us at: ${instituteInfo.contact.phones.join(" or ")}`;
    }

    // Intake/Registration queries
    if (query.includes("intake") || query.includes("when") || 
        query.includes("start") || query.includes("begin")) {
        return `Registration is ongoing for the ${getCurrentIntakeInfo()}! Contact us to secure your place.`;
    }

    // Course related queries
    if (query.includes("course") || query.includes("program")) {
        if (query.includes("certificate")) {
            return "Our National Certificate Programs (2 years) include:\n" +
                   instituteInfo.courses.nationalCertificate.join("\n- ");
        }
        if (query.includes("diploma")) {
            return "Our National Diploma Programs (3 years) include:\n" +
                   instituteInfo.courses.nationalDiploma.join("\n- ");
        }
        if (query.includes("short") || query.includes("1 month")) {
            return "Our Short Courses (1 month) include:\n" +
                   instituteInfo.courses.shortCourses.join("\n- ");
        }
        if (query.includes("vocational")) {
            return "Our Vocational Courses (6 months) include:\n" +
                   instituteInfo.courses.vocationalCourses.join("\n- ");
        }
        return "We offer various programs:\n\n" +
               "1. National Certificate Programs (2 years)\n" +
               "2. National Diploma Programs (3 years)\n" +
               "3. Short Courses (1 month)\n" +
               "4. Vocational Courses (6 months)\n\n" +
               "Which category would you like to know more about?";
    }

    // Admission/Registration queries
    if (query.includes("admission") || query.includes("register") || 
        query.includes("enroll") || query.includes("intake")) {
        return `${instituteInfo.registration.status} for ${instituteInfo.registration.intake}!\n\n` +
               "Admission Requirements:\n- " +
               instituteInfo.admissionRequirements.join("\n- ");
    }

    return null; // Return null if query isn't specifically about the institute
}

async function callGeminiAPI(prompt) {
    // First check if it's an institute-related query
    const instituteResponse = handleInstituteQuery(prompt);
    if (instituteResponse) {
        return instituteResponse;
    }

    // If not institute-related, proceed with Gemini API call
    const identityKeywords = [
        "who made you", "who created you", "who developed you",
        "what are you", "who are you", "what model are you",
        "what's your name", "what is your name", "when was you created"
    ];
    
    if (identityKeywords.some(keyword => prompt.toLowerCase().includes(keyword))) {
        return "I'm Paradigm Institute & FM AI assistant. I was created by Lucky to help you!";
    }

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
    emailjs.init("OUWdr0kTs6aX5J2PW");
    console.log("EmailJS initialized with public key"); // Verify initialization
})();

// Update the sendNotification function with troubleshooting comments
async function sendNotification(userMessage) {
    console.log("Starting email notification..."); // Debug point 1
    try {
        // SERVICE ID (Get from: Email Services > Your Service > Service ID)
        // If wrong: Login to EmailJS > Email Services > Click your service
        const SERVICE_ID = "service_wgq1nd8";
        
        // TEMPLATE ID (Get from: Email Templates > Your Template > Template ID)
        // If wrong: Login to EmailJS > Email Templates > Click your template
        const TEMPLATE_ID = "template_rdijcqi";
        
        // Verify keys before sending
        console.log("Using Service ID:", SERVICE_ID); // Debug point 2
        console.log("Using Template ID:", TEMPLATE_ID); // Debug point 3

        const response = await emailjs.send(
            SERVICE_ID,
            TEMPLATE_ID,
            {
                // These must match EXACTLY with your template variables
                // To check: Go to EmailJS > Email Templates > Edit your template
                to_name: "Admin",
                from_name: "Website Visitor",
                message: userMessage,
                timestamp: new Date().toLocaleString()
            }
        );

        // Success logs
        console.log("Email sent successfully!", response);
        console.log("If you didn't receive the email:");
        console.log("1. Check spam folder");
        console.log("2. Verify email address in EmailJS service settings");
        console.log("3. Confirm template variables match exactly");

        return response;
    } catch (error) {
        // Error logs for troubleshooting
        console.error("==== EmailJS Error ====");
        console.error("Error type:", error.name);
        console.error("Error message:", error.message);
        console.error("Check if:");
        console.error("1. Public Key is correct");
        console.error("2. Service ID is correct");
        console.error("3. Template ID is correct");
        console.error("4. Template variables match");
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
    
    const welcomeMessage = `<div class="title-header">WELCOME TO PARADIGM INSTITUTE & FM!</div>

I'm your AI Assistant for Paradigm Institute of Business and Media Studies and Paradigm FM 100.0.

<div class="title-header">OUR PROGRAMS:</div>

<ul>
  <li>📚 DIPLOMA PROGRAMS (3 Years)</li>
  <li>📝 CERTIFICATE PROGRAMS (2 Years)</li>
  <li>⚡ SHORT COURSES (1 Month)</li>
  <li>🛠️ VOCATIONAL PROGRAMS (6 Months)</li>
</ul>

<div class="title-header">RADIO PROGRAMS:</div>

📻 PARADIGM FM 100.0
<ul>
  <li>Morning: Ekyererezi (5:00 am - 10:00 am)</li>
  <li>Afternoon: Entuyo Zange (10:00 am - 2:00 pm)</li>
  <li>Evening: Home Drive (2:00 pm - 6:00 pm)</li>
  <li>Night: Evening Cruiz (6:00 pm - 9:00 pm)</li>
</ul>

Ask me about our programs, admission, radio services, or contact information!`;

    addMessage(welcomeMessage, false, timestamp);
});