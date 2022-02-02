import { html, render } from 'https://unpkg.com/lit-html@1.0.0/lit-html.js';

class RVMCheck extends HTMLElement {
    constructor() {
        super();

        this.render();

    }

    renderCheck = (healthCheckItem) => {
        
        return html`
                <li class="${healthCheckItem.passed ? "good" : "bad"}">
                    <led title="${healthCheckItem.test}"></led>
                    <span title="${healthCheckItem.test}">${healthCheckItem.test}</span>
                </li>
        `;
        // <h5>${healthCheckItem.test}</h5>
        // <div>Passed: ${healthCheckItem.passed}</div>
        // <div>Message: ${healthCheckItem.message}</div>
        // <div>Error code: ${healthCheckItem.windowsErrorCode}</div>
    }

    render = async () => {
        const rvmInfo = await fin.System.runRvmHealthCheck();

        const content = html`
        <content>
            <ul>
            ${Object.entries(rvmInfo).map(e => {return this.renderCheck(e[1])})}
            </ul>
        </content>
             `;
        return render(content, this);
    }
}


customElements.define('rvm-check', RVMCheck);