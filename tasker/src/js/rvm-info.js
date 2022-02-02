import { html, render } from 'https://unpkg.com/lit-html@1.0.0/lit-html.js';

class RVMInfo extends HTMLElement {
    constructor() {
        super();

        this.render();

    }

    runHealthCheck = async () => {
        const currentWindow = await fin.me.getCurrentWindow();
        fin.Platform.getCurrentSync().createView({ url: window.location.href.replace('ps-view', 'rvm-check')}, currentWindow.identity);
    }

    render = async () => {
        const rvmInfo = await fin.System.getRvmInfo();

        const content = html`
        <div>
            <h3>RVM Information:</h3>
            <div>Version: ${rvmInfo.version}</div>
            <div>Start time: ${rvmInfo.startTime}</div>
            <div>Working Dir: ${rvmInfo["working-dir"]}</div>
            <div>Path: ${ rvmInfo.path}</div>
            <div>Application Log directory: ${rvmInfo.appLogDirectory}</div>
            <div><button @click=${() => { this.runHealthCheck();} }}>Run RVM Health Check</button></div>
        </div>
             `;
        return render(content, this);
    }
}


customElements.define('rvm-info', RVMInfo);