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
                padding: 7px 11px;  /* Some padding */
                border-radius: 27px; /* Rounded corners */
                
                svg {
                    fill: white;
                    width: 20px;
                }
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
        return this.getAttribute('data-label') || '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2 160 448c0 17.7 14.3 32 32 32s32-14.3 32-32l0-306.7L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z"/></svg>';
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