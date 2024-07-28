class BackTop extends HTMLElement {
    // register 
    static tag = "back-top";
    static register(safe = true) {
        if (!safe) {
            return customElements.define(BackTop.tag, BackTop);
        } else {
            document.addEventListener('DOMContentLoaded', () => customElements.define(BackTop.tag, BackTop));
        }
    }

    // component life cycle
    constructor() {
        super();
        this.events = {};
        this.attachShadow({ mode: 'open' });
        window.onscroll = () => {
            this.scrollFunction();
        };
        this.render();
    }
    connectedCallback() {
        const observer = new MutationObserver(() => this.render());
        observer.observe(this, { childList: true, subtree: true });
        this.button?.addEventListener('click', this.onClick);
    }
    disconnectedCallback() {
        this.button.removeEventListener('click', this.onClick);
        this.cleanEvents();
    }
    attributeChangedCallback(attrName, oldVal, newVal) {
        if (attrName === 'data-content') {
            this.render();
        }
    }

    // render 
    render() {
        const wrapper = document.createElement('div');
        wrapper.setAttribute('class', 'theme-switcher');

        const button = document.createElement('button');
        button.setAttribute('id', 'btn-top');
        button.setAttribute('class', 'btn-top');
        button.innerHTML =  this.label;

        const style = document.createElement('style');
        style.textContent = `
			.btn-top {
                display: none; /* Hidden by default */
                position: fixed; /* Fixed/sticky position */
                bottom: 20px; /* Place the button at the bottom */
                right: 30px; /* Place the button 30px from the right */
                z-index: 99; /* Make sure it does not overlap */
                border: none; /* Remove borders */
                outline: none; /* Remove outline */
                background-color: #555; /* Set a background color */
                color: white; /* Text color */
                cursor: pointer; /* Add a mouse pointer on hover */
                padding: 15px; /* Some padding */
                border-radius: 10px; /* Rounded corners */
            }
        
            .btn-top:hover {
                background-color: #333; /* Add a dark-grey background on hover */
            }
        `;

        wrapper.appendChild(button);
        this.shadowRoot.append(style, wrapper);

        this.button = button;
        this.onClick = this.onClick.bind(this);
        this.registerEvent('on-change');
    }

    // properties 
    static get observedAttributes() {
        return ['data-label'];
    }
    get label() {
        return this.getAttribute('data-label') || '<i class="fa-thin fa-up-to-dotted-line"></i>';
    }
    set label(val) {
        if (val) {
            this.setAttribute('data-label', val);
        } else {
            this.removeAttribute('data-label');
        }
    }

    // events 
    onClick() {
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
        this.emitEvent('on-change', { value: true })
    }

    emitEvent(name, data) {
        this.dispatchEvent(new CustomEvent(name, {
            detail: data,
            bubbles: true,
            composed: true
        }));
    }

    registerEvent(eventName) {
        if (eventName && this.hasAttribute(eventName)) {
            let handler = this.getAttribute(eventName);
            if (handler) {
                this.events[eventName] = function (event) {
                    new Function('event', handler).call(this, event);
                };
                this.addEventListener(eventName, this.events[eventName]);
            }
        }
    }

    cleanEvents() {
        for (let eventName in this.events) {
            let handler = this.events[eventName];
            this.removeEventListener(eventName, handler);
            delete this.events[eventName];
        }
    }

    // internal methods
    scrollFunction() {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            this.button.style.display = "block";
        } else {
            this.button.style.display = "none";
        }
    }
}