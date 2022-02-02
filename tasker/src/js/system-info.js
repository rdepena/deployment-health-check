import { html, render } from 'https://unpkg.com/lit-html@1.0.0/lit-html.js';

class SystemInfo extends HTMLElement {
    constructor() {
        super();

        this.render();

    }

    render = async () => {
        const runtimeInfo = await fin.System.getRuntimeInfo();
        const rvmInfo = await fin.System.getRvmInfo();
        const crashReportState = await fin.System.getCrashReporterState();
        const logLevel = await fin.System.getMinLogLevel();
        const content = html`
        <content>
            <table cellpadding="0" cellspacing="0" border="0">
            </tbody>
                <tr>
                    <td class="label">Runtime Version</td>
                    <td class="detail">${runtimeInfo.version} (${runtimeInfo.architecture})</td>
                </tr>
                <tr>
                    <td class="label">Electron Version</td>
                    <td class="detail">${runtimeInfo.electronVersion}</td>
                </tr>
                <tr>
                    <td class="label">Chrome Version</td>
                    <td class="detail">${runtimeInfo.chromeVersion}</td>
                </tr>
                <tr>
                    <td class="label">RVM Version</td>
                    <td class="detail">${rvmInfo.version}</td>
                </tr>
                <tr>
                    <td class="label">Cache Path</td>
                    <td class="detail">${runtimeInfo.cachePath}</td>
                </tr>
                <tr>
                    <td class="label">Crash reporter running</td>
                    <td class="detail">${crashReportState.isRunning}</td>
                </tr>
                <tr>
                    <td class="label">In Diagnostics mode</td>
                    <td class="detail">${crashReportState.diagnosticMode}</td>
                </tr>
                <tr>
                    <td class="label">Working Dir</td>
                    <td class="detail">${rvmInfo["working-dir"]}</td>
                </tr>
                <tr>
                    <td class="label">RVM Path</td>
                    <td class="detail">${rvmInfo.path}</td>
                </tr>
                <tr>
                    <td class="label">Application Log directory</td>
                    <td class="detail">${rvmInfo.appLogDirectory}</td>
                </tr>
                <tr>
                    <td class="label">Min log level</td>
                    <td class="detail">${logLevel}</td>
                </tr>
                <tr>
                    <td class="label">Runtime Args</td>
                    <td class="detail">${ Object.keys(runtimeInfo.args).map(k => html`
                    ${k}: ${runtimeInfo.args[k]} </br>
                    `)}</td>
                </tr>
            </tbody>
            </table>
            <button @click=${() => { this.runHealthCheck();} }}>Run RVM Health Check</button>
            <button @click=${() => { this.processViewer();} }}>Start Process viewer</button>
            <button @click=${() => { fin.System.setMinLogLevel("verbose"); this.render(); }}>Set verbose log mode</button>
            <button @click=${() => {fin.System.startCrashReporter({diagnosticMode: true}); this.render(); }}>Start crash reporter</button>
        </content>
             `;
        return render(content, this);
    }

    runHealthCheck = async () => {
        const currentWindow = await fin.me.getCurrentWindow();
        fin.Platform.getCurrentSync().createView({ url: window.location.href.replace('system-info', 'rvm-check')}, currentWindow.identity);
    }

    processViewer = async () => {
        const currentWindow = await fin.me.getCurrentWindow();
        fin.Platform.getCurrentSync().createView({ url: window.location.href.replace('system-info', 'ps-view')}, currentWindow.identity);
    }
}


customElements.define('system-info', SystemInfo);