export class learningLog {
  constructor(containerId) {
    // this.container = document.getElementById(containerId);
    // this.buttons = document.querySelectorAll('button[data-tag]');

    // // Add click event listeners to buttons
    // this.buttons.forEach(button => {
    //   button.addEventListener('click', () => this.filterItems(button.dataset.tag));
    // });

    console.log('this');
  }

  // sortAndOrderItems(tag) {
  //   const items = Array.from(this.container.children);

  //   // Filter items based on the selected tag
  //   const filteredItems = tag === 'all' ? items : items.filter(item => item.dataset.tag === tag);

  //   // Remove existing items from the list
  //   items.forEach(item => this.container.removeChild(item));

  //   // Append the filtered items in the desired order
  //   filteredItems.forEach(item => this.container.appendChild(item));
  // }

  // filterItems(tag) {
  //   const items = document.querySelectorAll('.item');

  //   // Add 'active' class to items with the selected tag and remove it from others
  //   items.forEach(item => {
  //     if (tag === 'all' || item.dataset.tag === tag) {
  //       item.classList.add('active');
  //     } else {
  //       item.classList.remove('active');
  //     }
  //   });

  //   // Sort and order items based on the selected tag
  //   this.sortAndOrderItems(tag);
  // }
}
