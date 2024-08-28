class ThemeSwitcher extends HTMLElement {
	// register 
	static tag = "theme-switcher";
	static register(safe = true) {
		if (!safe) {
			return customElements.define(ThemeSwitcher.tag, ThemeSwitcher);
		} else {
			document.addEventListener('DOMContentLoaded', () => customElements.define(ThemeSwitcher.tag, ThemeSwitcher));
		}
	}

	// component life cycle
	constructor() {
		super();
		this.events = {};
		this.icons = {
			dark: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M223.5 32C100 32 0 132.3 0 256S100 480 223.5 480c60.6 0 115.5-24.2 155.8-63.4c5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-9.8 1.7-19.8 2.6-30.1 2.6c-96.9 0-175.5-78.8-175.5-176c0-65.8 36-123.1 89.3-153.3c6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-6.3-.5-12.6-.8-19-.8z"/></svg>',
			light: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M361.5 1.2c5 2.1 8.6 6.6 9.6 11.9L391 121l107.9 19.8c5.3 1 9.8 4.6 11.9 9.6s1.5 10.7-1.6 15.2L446.9 256l62.3 90.3c3.1 4.5 3.7 10.2 1.6 15.2s-6.6 8.6-11.9 9.6L391 391 371.1 498.9c-1 5.3-4.6 9.8-9.6 11.9s-10.7 1.5-15.2-1.6L256 446.9l-90.3 62.3c-4.5 3.1-10.2 3.7-15.2 1.6s-8.6-6.6-9.6-11.9L121 391 13.1 371.1c-5.3-1-9.8-4.6-11.9-9.6s-1.5-10.7 1.6-15.2L65.1 256 2.8 165.7c-3.1-4.5-3.7-10.2-1.6-15.2s6.6-8.6 11.9-9.6L121 121 140.9 13.1c1-5.3 4.6-9.8 9.6-11.9s10.7-1.5 15.2 1.6L256 65.1 346.3 2.8c4.5-3.1 10.2-3.7 15.2-1.6zM160 256a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zm224 0a128 128 0 1 0 -256 0 128 128 0 1 0 256 0z"/></svg>'
		};
		this.attachShadow({ mode: 'open' });
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
		button.setAttribute('id', 'theme-toggle');
		button.setAttribute('class', 'switcher');
		button.innerHTML = `
			${this.icons.light} 
			${this.icons.dark} 
		`;

		const style = document.createElement('style');
		style.textContent = `
			.switcher {
				background: #1515169C;
				border-radius: 1000px;
				border: none;
				position: relative;
				cursor: pointer;
				display: flex;
				outline: none;
				&::after {
					content: "";
					display: block;
					width: 30px;
					height: 30px;
					position: absolute;
					background: #F1F1F1;
					top: 0;
					left: 0;
					right: unset;
					border-radius: 100px;
					transition: .3s ease all;
					box-shadow: 0px 0px 2px 2px rgba(0,0,0,.2);
				}
				&.active {
					background: #97ec6763;
					color: #000;
					&::after {
						right: 0;
						left: unset;
					}
				}
				svg {
					width: 26px;
					height: 25px;
					line-height: 25px;
					display: block;
					background: none;
					color: #fff;
					fill: #fff;
				}
			}
        `;

		wrapper.appendChild(button);
		this.shadowRoot.append(style, wrapper);

		this.button = button;
		this.onClick = this.onClick.bind(this);
		this.registerEvent('on-change');
		this.setTheme({ theme: 'auto', key: this.source });
	}

	// properties 
	static get observedAttributes() {
		return ['data-store', 'data-source', 'on-change', 'data-content'];
	}
	get store() {
		return this.getAttribute('data-store') || 'theme';
	}
	set store(val) {
		if (val) {
			this.setAttribute('data-store', val);
		} else {
			this.removeAttribute('data-store');
		}
	}
	get source() {
		return this.getAttribute('data-source') || 'data-theme';
	}
	set source(val) {
		if (val) {
			this.setAttribute('data-source', val);
		} else {
			this.removeAttribute('data-source');
		}
	}

	// events 
	onClick() {
		this.setTheme({ theme: 'toggle', key: this.source });
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
	defaultTheme() {
		return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
	}

	toggleTheme() {
		return document.documentElement.getAttribute(this.source) === 'dark' ? 'light' : 'dark';
	}

	currentTheme(theme = 'light') {
		console.log(theme);
		if (theme === 'auto') {
			return localStorage.getItem(this.store) || this.defaultTheme();
		}
		if (theme === 'toggle') {
			return this.toggleTheme();
		}
		return theme;
	}

	setTheme({ theme = 'auto', key = 'data-theme' }) {
		let newTheme = this.currentTheme(theme);
		let isLight = newTheme === 'light';
		let isActive = this.button.classList?.contains('active');
		document.documentElement.setAttribute(key, newTheme);
		localStorage.setItem(this.store, newTheme);
		((isLight && !isActive) || (!isLight && isActive)) && this.button.classList.toggle('active');
		this.emitEvent('on-change', { value: newTheme });
		return newTheme;
	}
}