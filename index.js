import menuArray from './data.js'

const menuList = document.getElementById('menu-list')
const costumerOrder = document.getElementById('costumer-order')
const orderList = document.getElementById('order-list')
const orderTotalPrice = document.getElementById('order-total-price')
const completeOrderBtn = document.getElementById('complete-order-btn')
const paymentModal = document.getElementById('payment-modal')
const payBtn = document.getElementById('pay-btn')
const orderSentContainer = document.getElementById('order-sent-container')
const orderSentMessage = document.getElementById('order-sent-message')
const newOrderBtn = document.getElementById('new-order-btn')


document.addEventListener('click', (e) => {
    if (e.target.classList.contains('add-btn')) {
        costumerOrder.classList.remove('hidden') // Showing user's order section (bottom)
        const itemId = parseInt(e.target.dataset.id)
        const selectedItem = menuArray.find( item => item.id === itemId)
        if (selectedItem) {
            addItem(selectedItem) // Calling the addItem() function
        }
    }
    else if (e.target.classList.contains('btn-remove')) {
        const itemToRemove = e.target.closest('.item-added')
        if (itemToRemove) {
            removeItem(itemToRemove) // Calling the removeItem() function
        }
    }
})

completeOrderBtn.addEventListener('click', (e) => paymentModal.classList.remove('hidden'))

payBtn.addEventListener('click', (e) => {
    e.preventDefault() // This is to prevent page reload after click (default behavior)
    paymentModal.classList.add('hidden')
    costumerOrder.classList.add('hidden')
    orderSentContainer.classList.remove('hidden')
    newOrderBtn.classList.remove('hidden')
    
    const customerName = document.getElementById('customer-name').value
    orderSentMessage.textContent = `Thanks, ${customerName}! Your order is on its way!`
})

newOrderBtn.addEventListener('click', () => location.reload())


function addItem(item) {
    const existingItem = orderList.querySelector(`[data-id="${item.id.toString()}"]`)
    if (existingItem) {
        const quantityEl = existingItem.querySelector('.item-quantity')
        const currentQty = parseInt(quantityEl.textContent) || 1;
        quantityEl.textContent = currentQty + 1
        
        const priceEl = existingItem.querySelector('.order-item-price')
        priceEl.textContent = `${item.price * (currentQty + 1)}`
        getTotalPrice()
        return
    }
    const itemHtml = `
        <li class="item-added" data-id="${item.id}">
            <p class="order-item-title">${item.name}</p>
            <p class="item-quantity">${item.currentQty, 1}</p>
            <button class="btn-remove">remove</button>
            <p class="order-item-price">${item.price}</p>
        </li>
    `
    orderList.insertAdjacentHTML('beforeend', itemHtml)
    getTotalPrice() // Calling getTotalPrices() function
}

function getTotalPrice() {
    const totalPrice = Array.from(orderList.querySelectorAll('.order-item-price'))
        .reduce( (total, priceEl) => total + parseInt(priceEl.textContent), 0)
    
    orderTotalPrice.textContent = totalPrice
}

function removeItem(itemToRemove) {
    if (itemToRemove) {
        const quantityEl = itemToRemove.querySelector('.item-quantity')
        const currentQty = parseInt(quantityEl.textContent)
        if (currentQty > 1) {
            const priceEl = itemToRemove.querySelector('.order-item-price')
            const unitPrice = parseInt(priceEl.textContent.replace('$', '')) / currentQty
            quantityEl.textContent = currentQty - 1
            priceEl.textContent = `${unitPrice * (currentQty - 1)}`
        }
        else {
            itemToRemove.remove()
            if (!orderList.children.length) {
                costumerOrder.classList.add('hidden') // Hiding user's order section (bottom)
            }
        }
        getTotalPrice()
    }
}

function getMenuItems() {
    return menuArray.map( item => {
        const ingredientsList = item.ingredients.map( ingredient => ' ' + ingredient)
        return `
            <li class="menu-item">
                <div class="item-image-wrapper">
                    <p class="item-icon">${item.emoji}</p>
                </div>
                <div class="item-text-wrapper">
                    <h3 class="item-title">${item.name}</h3>
                    <p class="item-ingredients">${ingredientsList}</p>
                    <h4 class="item-price">$${item.price}</h4>
                </div>
                <div class="item-btn-wrapper">
                    <button data-id="${item.id}" class="add-btn">
                        <span class="material-symbols-outlined">add</span>
                    </button>
                </div>
            </li>
            <hr class="separator">`
    }).join('')
}

menuList.innerHTML = getMenuItems(menuArray)