function filterItems(category) {
    // Remove 'active' class from all filter links
    const filterLinks = document.querySelectorAll('.nav-filter a');
    filterLinks.forEach(link => link.classList.remove('active'));
    
    // Add 'active' class to the clicked filter link
    const activeLink = Array.from(filterLinks).find(link => link.textContent.trim().toLowerCase() === category.toLowerCase());
    if (activeLink) {
        activeLink.classList.add('active');
    }

    // Show or hide items based on the selected category
    const items = document.querySelectorAll('.tui-window');
    items.forEach(item => {
        const itemCategories = item.getAttribute('data-category').split(' ');
        if (itemCategories.includes(category) || category === 'all') {
            item.classList.add('show');
        } else {
            item.classList.remove('show');
        }
    });
}


function toggleDetails(id) {
    const details = document.getElementById(id);
    const icon = details.previousElementSibling.querySelector('.toggle-icon');

    if (details.style.display === "none" || details.style.display === "") {
        details.style.display = "block";
        icon.textContent = "-";
    } else {
        details.style.display = "none";
        icon.textContent = "+";
    }
}




// ——————————————————————————————————————————————————
// TextScramble
// ——————————————————————————————————————————————————

class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = '!<>-_\\/[]{}—=+*^?#________';
    this.update = this.update.bind(this);
    this.scrambleText = this.scrambleText.bind(this);
  }

  scrambleText() {
    const originalText = this.el.innerText;
    this.setText(originalText).then(() => {
      setTimeout(() => this.scrambleText(), 800); // Adjust the delay as needed
    });
  }

  setText(newText) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise((resolve) => this.resolve = resolve);
    this.queue = [];
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
      this.queue.push({ from, to, start, end });
    }
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }

  update() {
    let output = '';
    let complete = 0;
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.randomChar();
          this.queue[i].char = char;
        }
        output += `<span class="dud">${char}</span>`;
      } else {
        output += from;
      }
    }
    this.el.innerHTML = output;
    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }

  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}

// Initialize and continuously scramble text inside the div
const el = document.querySelector('.scrambling-text');
const fx = new TextScramble(el);
fx.scrambleText();

