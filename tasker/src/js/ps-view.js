import { html, render } from 'https://unpkg.com/lit-html@1.0.0/lit-html.js';

const KB = 1024;
const MB = KB * 1024;
const GB = MB * 1024;

export const formatBytes = (size, places) => {
    if (size > GB) {
        return (size / GB).toFixed(places) + 'GB';
    } else if (size > MB) {
        return (size / MB).toFixed(places) + 'MB';
    } else if (size > KB) {
        return (size / KB).toFixed(places) + 'KB';
    } else if (size === 0) {
        return '0';
    } else {
        return size.toFixed(1) + 'B';
    }
};

async function buildProcessList() {
    const app = fin.Application.getCurrentSync();
    const windows = await app.getChildWindows();
    const ps = await app.getProcessInfo();
    const psEntities = [];

    function findPSInfo(identity) {
        return ps.entities.find(p => p.name === identity.name)
    }

    const windowViews = await Promise.all(await windows.map(async w => {
        const views = (await w.getCurrentViews()).map(v => {
            const psInfo = findPSInfo(v.identity);
            return Object.assign(v, { psInfo });
        });

        const psInfo = findPSInfo(w.identity);
        
        return Object.assign(w, { views, psInfo });
    }));

    let flatEntities = [];
    windowViews.forEach(w => {
        flatEntities.push(w);
        flatEntities = flatEntities.concat(w.views);
    });

    return flatEntities;
}

class PsViewer extends HTMLElement {
    constructor() {
        super();

        this.render();

    }


    toMb = (kb) => {
        return kb / 10240;
    }

    render = async () => {
        const processList = await buildProcessList();
        const content = html`
        <content>
        <table class="ps-table" cellpadding="0" cellspacing="0" border="0">
            <tr>
                <th class="label">Entity Type</th>
                <th class="label">CPU Usage</th>
                <th class="label">Private Set</th>
                <th class="label">Working Set</th>
                <th class="label">PID</th>
                <th class="label">Actions</th>
                <th class="label">url</th>
                <th class="label">Name</th>
            </tr>
            ${processList.map(pw =>  html`
                <tr>
                    <td>
                        ${pw.psInfo.entityType}
                    </td>
                    <td>
                        ${pw.psInfo.cpuUsage}%
                    </td>
                    <td>
                        ${formatBytes(pw.psInfo.privateSetSize, 2)}
                    </td>
                    <td>
                        ${formatBytes(pw.psInfo.workingSetSize, 2)}  
                    </td>
                    <td>
                        ${pw.psInfo.pid}
                    </td>
                    <td>
                        <button @click=${() => { pw.focus(); } }>Focus</button>
                        <button @click=${() => { pw.showDeveloperTools(); } }>Debugger</button>
                    </td>
                    <td>
                        ${pw.psInfo.url}
                    </td>
                    <td>
                        ${pw.psInfo.name}
                    </td>
                </tr>
            `)}
             </table>
             </content>
             `;
        setTimeout(this.render, 1000);
        return render(content, this);
    }
}


customElements.define('ps-viewer', PsViewer);

window.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded and parsed');
});
