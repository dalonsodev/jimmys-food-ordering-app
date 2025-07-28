import menuArray from './data.js'

const costumerOrder = document.getElementById('costumer-order')
const orderList = document.getElementById('order-list')
const paymentModal = document.getElementById('payment-modal')
const newOrderBtn = document.getElementById('new-order-btn')
const orderSentContainer = document.getElementById('order-sent-container')
const orderSentMessage = document.getElementById('order-sent-message')

// Utility functions
function toggleHidden(element, isHidden) {
   element.classList.toggle('hidden', isHidden)
}

// UI Logic (functions) 
// Generate HTML for menu items to be rendered
function getMenuItems() {
   return menuArray.map( item => {
      const ingredientsList = item.ingredients.join(", ")
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
                  <button data-action="add" data-id="${item.id}" class="add-btn" aria-label="Add ${item.name} to order">
                     <span class="material-symbols-outlined">add</span>
                  </button>
               </div>
         </li>
         <hr class="separator">`
   }).join('')
}

// Show/hide payment modal
function togglePaymentModal(isHidden) {
   toggleHidden(paymentModal, isHidden)
}

// Displays order confirmation message and updates UI state
function completeOrder(customerName) {
   toggleHidden(paymentModal, true)
   toggleHidden(costumerOrder, true)
   toggleHidden(orderSentContainer, false)
   toggleHidden(newOrderBtn, false)
   orderSentMessage.textContent = `Thanks ${customerName}! Your order is on its way!`
   document.querySelectorAll('[data-action="add"]').forEach(btn => {
      btn.disabled = true
      btn.setAttribute('aria-disabled', 'true')
   })
}

// Data Logic
// Updates quantity and price for the order item in the DOM
function updateItemElement(itemElement, item, quantity) {
   const quantityEl = itemElement.querySelector('.item-quantity')
   const priceEl = itemElement.querySelector('.order-item-price')
   quantityEl.textContent = quantity
   priceEl.textContent = `$${item.price * quantity}`
}

// Adds an item to the customer's order and increments its quantity
function addItem(item) {
   const existingItem = orderList.querySelector(`[data-id="${item.id}"]`)
   if (existingItem) {
      const quantityEl = existingItem.querySelector('.item-quantity')
      const currentQty = parseInt(quantityEl.textContent) || 1;

      updateItemElement(existingItem, item, currentQty + 1)
      getTotalPrice()
      return
   }
   const itemHtml = `
      <li class="item-added" data-id="${item.id}">
         <p class="order-item-title">${item.name}</p>
         <p class="item-quantity">1</p>
         <button data-action="remove" class="btn-remove" aria-label="Remove ${item.name} from order">remove</button>
         <p class="order-item-price">${item.price}</p>
      </li>
   `
   orderList.insertAdjacentHTML('beforeend', itemHtml)
   getTotalPrice()
}

// Removes an item from the customer's order and decrements its quantity
function removeItem(itemToRemove) {
   if (itemToRemove) {
      const quantityEl = itemToRemove.querySelector('.item-quantity')
      const currentQty = parseInt(quantityEl.textContent)
      const itemId = itemToRemove.dataset.id
      const item = menuArray.find(item => item.id === parseInt(itemId))
      if (currentQty > 1) {
         updateItemElement(itemToRemove, item, currentQty - 1)
      }
      else {
         itemToRemove.remove()
         if (!orderList.children.length) {
            toggleHidden(costumerOrder, true) // Hiding user's order section (bottom)
         }
      }
      getTotalPrice()
   }
}

// Calculates order's total price
function getTotalPrice() {
   const totalPrice = Array.from(orderList.querySelectorAll('.order-item-price'))
      .reduce( (total, priceEl) => total + parseInt(priceEl.textContent.replace('$', '')), 0)
   
   document.getElementById('order-total-price').textContent = totalPrice
}

// Handles adding/removing items from the order
function handleItemAction(action, itemId, itemElement) {
   if (action === 'add') {
      toggleHidden(costumerOrder, false)
      const selectedItem = menuArray.find(item => item.id === parseInt(itemId))
      if (selectedItem) addItem(selectedItem)
   }
   else if (action === 'remove' && itemElement) {
      removeItem(itemElement)
   }
}

// Event Listeners
document.addEventListener('click', (e) => {
   const addBtn = e.target.closest('[data-action="add"]')
   const removeBtn = e.target.closest('[data-action="remove"]')
   if (addBtn) {
      handleItemAction('add', addBtn.dataset.id)
   }
   else if (removeBtn) {
      handleItemAction('remove', null, removeBtn.closest('.item-added'))
   }
})

document.getElementById('complete-order-btn').addEventListener('click', () => 
   togglePaymentModal(false))
document.getElementById('close-modal-btn').addEventListener('click', () => 
   togglePaymentModal(true))

document.getElementById('payment-form').addEventListener('submit', (e) => {
   e.preventDefault() // To prevent page reload after submit (default behavior)
   const customerName = document.getElementById('customer-name').value
   completeOrder(customerName)
})

newOrderBtn.addEventListener('click', () => location.reload())

// Initialization
document.getElementById('menu-list').innerHTML = getMenuItems()