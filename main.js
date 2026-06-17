/**
 * Kanban Board - Pure Frontend Task Management
 */

// State
let columns = [];
let draggedCard = null;
let draggedColumn = null;

// Default columns
const defaultColumns = [
    { id: 1, title: 'To Do', cards: [
        { id: 1, title: 'Welcome to Kanban', description: 'Drag cards between columns to organize your tasks' }
    ]},
    { id: 2, title: 'In Progress', cards: [] },
    { id: 3, title: 'Done', cards: [] }
];

// Load from localStorage or use defaults
function loadBoard() {
    const saved = localStorage.getItem('kanban-board');
    if (saved) {
        try {
            columns = JSON.parse(saved);
        } catch (e) {
            columns = defaultColumns;
        }
    } else {
        columns = defaultColumns;
    }
    render();
}

// Save to localStorage
function saveBoard() {
    localStorage.setItem('kanban-board', JSON.stringify(columns));
}

// Generate unique ID
function generateId() {
    return Date.now() + Math.random().toString(36).substr(2, 9);
}

// Render the board
function render() {
    const board = document.getElementById('board');
    board.innerHTML = columns.map(column => `
        <div class="column" data-id="${column.id}" draggable="true">
            <div class="column-header">
                <div style="display: flex; align-items: center; flex: 1;">
                    <input type="text" class="column-title" value="${escapeHtml(column.title)}" 
                           onchange="updateColumnTitle(${column.id}, this.value)">
                    <span class="column-count">${column.cards.length}</span>
                </div>
                <div class="column-actions">
                    <button class="btn-icon" onclick="deleteColumn(${column.id})" title="Delete Column">×</button>
                </div>
            </div>
            <div class="cards" data-column-id="${column.id}">
                ${column.cards.map(card => `
                    <div class="card" draggable="true" data-id="${card.id}" data-column-id="${column.id}">
                        <textarea class="card-title" rows="1" 
                                  onchange="updateCard(${column.id}, ${card.id}, 'title', this.value)"
                                  oninput="autoResize(this)">${escapeHtml(card.title)}</textarea>
                        <textarea class="card-description" rows="2" placeholder="Add description..."
                                  onchange="updateCard(${column.id}, ${card.id}, 'description', this.value)"
                                  oninput="autoResize(this)">${escapeHtml(card.description || '')}</textarea>
                        <div class="card-footer">
                            <span style="font-size: 11px; color: var(--text-secondary);">#${card.id.toString().slice(-4)}</span>
                            <div class="card-actions">
                                <button class="btn-icon" onclick="deleteCard(${column.id}, ${card.id})" title="Delete">×</button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
            <button class="btn-add-card" onclick="addCard(${column.id})">+ Add Card</button>
        </div>
    `).join('');

    // Re-attach drag events
    attachDragEvents();
}

// Escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Auto-resize textarea
function autoResize(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
}

// Add column
function addColumnModal() {
    const title = prompt('Enter column title:');
    if (title && title.trim()) {
        columns.push({
            id: generateId(),
            title: title.trim(),
            cards: []
        });
        saveBoard();
        render();
    }
}

// Update column title
function updateColumnTitle(columnId, title) {
    const column = columns.find(c => c.id === columnId);
    if (column && title.trim()) {
        column.title = title.trim();
        saveBoard();
    }
}

// Delete column
function deleteColumn(columnId) {
    if (confirm('Delete this column and all its cards?')) {
        columns = columns.filter(c => c.id !== columnId);
        saveBoard();
        render();
    }
}

// Add card
function addCard(columnId) {
    const column = columns.find(c => c.id === columnId);
    if (column) {
        const newCard = {
            id: generateId(),
            title: 'New Card',
            description: ''
        };
        column.cards.push(newCard);
        saveBoard();
        render();
        
        // Focus the new card title
        setTimeout(() => {
            const card = document.querySelector(`[data-id="${newCard.id}"] .card-title`);
            if (card) {
                card.focus();
                card.select();
            }
        }, 50);
    }
}

// Update card
function updateCard(columnId, cardId, field, value) {
    const column = columns.find(c => c.id === columnId);
    if (column) {
        const card = column.cards.find(c => c.id === cardId);
        if (card) {
            card[field] = value;
            saveBoard();
        }
    }
}

// Delete card
function deleteCard(columnId, cardId) {
    const column = columns.find(c => c.id === columnId);
    if (column) {
        column.cards = column.cards.filter(c => c.id !== cardId);
        saveBoard();
        render();
    }
}

// Drag and Drop - Card
function attachDragEvents() {
    // Card drag events
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('dragstart', handleCardDragStart);
        card.addEventListener('dragend', handleCardDragEnd);
    });

    // Column drag events
    document.querySelectorAll('.column').forEach(column => {
        column.addEventListener('dragstart', handleColumnDragStart);
        column.addEventListener('dragend', handleColumnDragEnd);
        column.addEventListener('dragover', handleColumnDragOver);
        column.addEventListener('dragleave', handleColumnDragLeave);
        column.addEventListener('drop', handleColumnDrop);
    });

    // Cards container drag events
    document.querySelectorAll('.cards').forEach(cards => {
        cards.addEventListener('dragover', handleCardsDragOver);
        cards.addEventListener('drop', handleCardsDrop);
    });
}

function handleCardDragStart(e) {
    draggedCard = {
        cardId: parseInt(e.target.dataset.id),
        columnId: parseInt(e.target.dataset.columnId)
    };
    e.target.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
}

function handleCardDragEnd(e) {
    e.target.classList.remove('dragging');
    document.querySelectorAll('.column').forEach(col => col.classList.remove('drag-over'));
    draggedCard = null;
}

function handleColumnDragStart(e) {
    if (e.target.classList.contains('column')) {
        draggedColumn = parseInt(e.target.dataset.id);
        e.dataTransfer.effectAllowed = 'move';
    }
}

function handleColumnDragEnd(e) {
    draggedColumn = null;
}

function handleColumnDragOver(e) {
    if (draggedColumn && !e.target.closest('.column').dataset.id == draggedColumn) {
        e.preventDefault();
        e.currentTarget.classList.add('drag-over');
    }
}

function handleColumnDragLeave(e) {
    e.currentTarget.classList.remove('drag-over');
}

function handleColumnDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    
    if (draggedColumn && draggedCard) {
        const targetColumnId = parseInt(e.currentTarget.dataset.id);
        moveCard(draggedCard.columnId, draggedCard.cardId, targetColumnId);
    }
}

function handleCardsDragOver(e) {
    if (draggedCard) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }
}

function handleCardsDrop(e) {
    e.preventDefault();
    
    if (draggedCard) {
        const targetColumnId = parseInt(e.currentTarget.dataset.columnId);
        moveCard(draggedCard.columnId, draggedCard.cardId, targetColumnId);
    }
}

function moveCard(fromColumnId, cardId, toColumnId) {
    const fromColumn = columns.find(c => c.id === fromColumnId);
    const toColumn = columns.find(c => c.id === toColumnId);
    
    if (fromColumn && toColumn) {
        const cardIndex = fromColumn.cards.findIndex(c => c.id === cardId);
        if (cardIndex !== -1) {
            const [card] = fromColumn.cards.splice(cardIndex, 1);
            toColumn.cards.push(card);
            saveBoard();
            render();
        }
    }
}

// Event Listeners
document.getElementById('addColumnBtn').addEventListener('click', addColumnModal);

// Initialize
loadBoard();
