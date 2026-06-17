/**
 * ToolHunt - Online Tools Directory
 * JavaScript functionality
 */

// Tools Data - 15 Tools
const tools = [
    // Design Tools
    {
        id: 1,
        name: "Figma",
        description: "Collaborative interface design tool for teams. Create, prototype, and gather feedback all in one place.",
        category: "design",
        icon: "🎨",
        price: "Free",
        url: "https://figma.com"
    },
    {
        id: 2,
        name: "Canva",
        description: "Design anything and publish anywhere. Beautiful graphics, presentations, social media content and more.",
        category: "design",
        icon: "✏️",
        price: "Freemium",
        url: "https://canva.com"
    },
    {
        id: 3,
        name: "Coolors",
        description: "Create perfect color palettes in seconds. The fastest way to find inspiration and generate harmonious schemes.",
        category: "design",
        icon: "🌈",
        price: "Free",
        url: "https://coolors.co"
    },
    {
        id: 4,
        name: "Unsplash",
        description: "Beautiful, free photos gifted by the world's most generous community of photographers.",
        category: "design",
        icon: "📷",
        price: "Free",
        url: "https://unsplash.com"
    },

    // Development Tools
    {
        id: 5,
        name: "VS Code",
        description: "Code editing redefined and optimized for building and debugging modern web and cloud applications.",
        category: "development",
        icon: "💻",
        price: "Free",
        url: "https://code.visualstudio.com"
    },
    {
        id: 6,
        name: "GitHub",
        description: "Where the world builds software. Millions of developers build and share code with GitHub.",
        category: "development",
        icon: "🐙",
        price: "Freemium",
        url: "https://github.com"
    },
    {
        id: 7,
        name: "CodePen",
        description: "Build, test, and discover front-end code. A playground for the web community.",
        category: "development",
        icon: "📝",
        price: "Free",
        url: "https://codepen.io"
    },
    {
        id: 8,
        name: "Stack Overflow",
        description: "The world's largest online community for developers to learn, share knowledge, and build their careers.",
        category: "development",
        icon: "💬",
        price: "Free",
        url: "https://stackoverflow.com"
    },

    // Productivity Tools
    {
        id: 9,
        name: "Notion",
        description: "All-in-one workspace for notes, docs, wikis, projects and collaboration. Write, plan, share.",
        category: "productivity",
        icon: "📓",
        price: "Freemium",
        url: "https://notion.so"
    },
    {
        id: 10,
        name: "Trello",
        description: "Visualize your projects with boards, lists, and cards. Organize everything from日常 tasks to大型项目.",
        category: "productivity",
        icon: "📋",
        price: "Freemium",
        url: "https://trello.com"
    },
    {
        id: 11,
        name: "Todoist",
        description: "The to-do list to organize work and life. Trusted by 30 million people worldwide.",
        category: "productivity",
        icon: "✅",
        price: "Freemium",
        url: "https://todoist.com"
    },
    {
        id: 12,
        name: "Miro",
        description: "The visual collaboration platform for teams. Brainstorm, plan, and run meetings in one place.",
        category: "productivity",
        icon: "🗺️",
        price: "Freemium",
        url: "https://miro.com"
    },

    // Utility Tools
    {
        id: 13,
        name: "Google Translate",
        description: "Translate text, documents, and websites between 100+ languages. Break language barriers instantly.",
        category: "utility",
        icon: "🌍",
        price: "Free",
        url: "https://translate.google.com"
    },
    {
        id: 14,
        name: "Grammarly",
        description: "Write clearly and confidently. AI-powered writing assistant that checks grammar, spelling, and more.",
        category: "utility",
        icon: "✍️",
        price: "Freemium",
        url: "https://grammarly.com"
    },

    // Media Tools
    {
        id: 15,
        name: "YouTube",
        description: "The world's largest video platform. Watch, upload and share videos with the global community.",
        category: "media",
        icon: "🎬",
        price: "Free",
        url: "https://youtube.com"
    },
    {
        id: 16,
        name: "Vimeo",
        description: "Professional video platform for creators. High-quality video hosting, streaming, and analytics.",
        category: "media",
        icon: "🎥",
        price: "Freemium",
        url: "https://vimeo.com"
    }
];

// State
let currentCategory = 'all';
let searchTerm = '';

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    renderTools();
    initSearch();
    initCategoryTabs();
    initNewsletter();
    initFooterLinks();
});

// Render Tools
function renderTools() {
    const grid = document.getElementById('toolsGrid');
    const noResults = document.getElementById('noResults');
    
    // Filter tools
    let filteredTools = tools;
    
    if (currentCategory !== 'all') {
        filteredTools = filteredTools.filter(tool => tool.category === currentCategory);
    }
    
    if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filteredTools = filteredTools.filter(tool => 
            tool.name.toLowerCase().includes(term) ||
            tool.description.toLowerCase().includes(term)
        );
    }
    
    // Show/hide no results
    if (filteredTools.length === 0) {
        grid.style.display = 'none';
        noResults.style.display = 'block';
    } else {
        grid.style.display = 'grid';
        noResults.style.display = 'none';
    }
    
    // Render cards
    grid.innerHTML = filteredTools.map(tool => `
        <a href="${tool.url}" target="_blank" rel="noopener noreferrer" class="tool-card" data-category="${tool.category}">
            <div class="tool-icon">${tool.icon}</div>
            <h3 class="tool-name">${tool.name}</h3>
            <p class="tool-description">${tool.description}</p>
            <div class="tool-meta">
                <span class="tool-category">
                    <span>${getCategoryIcon(tool.category)}</span>
                    ${capitalizeFirst(tool.category)}
                </span>
                <span class="tool-price ${tool.price.includes('Free') ? '' : 'paid'}">${tool.price}</span>
            </div>
        </a>
    `).join('');
}

// Helper Functions
function getCategoryIcon(category) {
    const icons = {
        design: '🎨',
        development: '💻',
        productivity: '⚡',
        utility: '🔧',
        media: '📷'
    };
    return icons[category] || '🔧';
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Search
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    
    searchInput.addEventListener('input', function(e) {
        searchTerm = e.target.value.trim();
        renderTools();
    });
    
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            this.value = '';
            searchTerm = '';
            renderTools();
        }
    });
}

// Category Tabs
function initCategoryTabs() {
    const tabs = document.querySelectorAll('.category-tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Update active state
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Filter tools
            currentCategory = this.dataset.category;
            renderTools();
        });
    });
}

// Newsletter Form
function initNewsletter() {
    const form = document.getElementById('newsletterForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = this.querySelector('input[type="email"]').value;
        const button = this.querySelector('button');
        
        // Validate email
        if (!email || !email.includes('@')) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Simulate submission
        const originalHTML = button.innerHTML;
        button.innerHTML = '<span>Subscribing...</span>';
        button.disabled = true;
        
        setTimeout(() => {
            button.innerHTML = '<span>✓ Subscribed!</span>';
            this.querySelector('input').value = '';
            
            showNotification('Thanks for subscribing! You\'ll receive updates soon.', 'success');
            
            setTimeout(() => {
                button.innerHTML = originalHTML;
                button.disabled = false;
            }, 3000);
        }, 1500);
    });
}

// Footer Category Links
function initFooterLinks() {
    const links = document.querySelectorAll('.footer-links a[data-category]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.dataset.category;
            
            // Update active tab
            document.querySelectorAll('.category-tab').forEach(tab => {
                tab.classList.toggle('active', tab.dataset.category === category);
            });
            
            currentCategory = category;
            renderTools();
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">×</button>
    `;
    
    // Styles
    notification.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        padding: 16px 24px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#6366f1'};
        color: white;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 14px;
        font-weight: 500;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        max-width: 400px;
    `;
    
    const closeBtn = notification.querySelector('button');
    closeBtn.style.cssText = `
        background: rgba(255,255,255,0.2);
        border: none;
        color: white;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.2s;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }
    }, 4000);
}

// Add animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);
