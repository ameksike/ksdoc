class CodeView extends HTMLElement {
    static tag = "code-view";
    static register(safe = true) {
        if (!safe) {
            return customElements.define(CodeView.tag, CodeView);
        } else {
            document.addEventListener('DOMContentLoaded', () => customElements.define(CodeView.tag, CodeView));
        }
    }
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    static get observedAttributes() {
        return ['data-tab', 'data-type'];
    }
    get tab() {
        return this.getAttribute('data-tab');
    }
    set tab(val) {
        if (val) {
            this.setAttribute('data-tab', val);
        } else {
            this.removeAttribute('data-tab');
        }
    }
    get type() {
        return this.getAttribute('data-type');
    }
    set type(val) {
        if (val) {
            this.setAttribute('data-type', val);
        } else {
            this.removeAttribute('data-type');
        }
    }

    connectedCallback() {
        const observer = new MutationObserver(() => this.render());
        observer.observe(this, { childList: true, subtree: true });
    }
    attributeChangedCallback(attrName, oldVal, newVal) {
        if (attrName === 'data-tab') {
            this.render();
        }
    }

    process(data, tab = 4) {
        try {
            tab = !tab || isNaN(tab) ? 4 : parseInt(tab);
            const jsonContent = JSON.parse(data);
            const textContent = JSON.stringify(jsonContent, null, tab);
            return textContent;
        } catch (_) {
            return data;
        }
    }
    render() {
        const tabAtt = this.tab;
        const typAtt = this.type;
        const origen = this.innerHTML.trim();
        const result = typAtt !== "raw" ? this.process(origen, tabAtt) : origen;

        this.shadowRoot.innerHTML = `
			<style>
				.code-view {
					color: white;
					background-color: #41444e;
					border-radius: 8px;
					padding: 10px;
					margin-top: 10px;
					margin-bottom: 10px;
					max-width: 100%;
					width: 100%;
					display: flex;
                    overflow: auto;
				}
			</style>
			<pre class="code-view">${result}</pre>
		`;
    }
}