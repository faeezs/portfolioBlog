import html2canvas from 'html2canvas';

export function groupData(data: object[], domain: never[], key: string) {
    let groups: object[] = [];
    if (key) {
        domain.forEach(group => {
            groups.push(data.filter(d => d[key as keyof object] == group));
        });
    } else {
        groups = [data];
    }
    return groups;
}

export function stackData(data: object[], domain: never[], valKey: string, grpKey: string) {
    const groups: object[] = [];
    let base = JSON.parse(JSON.stringify(data.filter(d => d[grpKey as keyof object] == domain[0])));
    base.forEach(d => d[valKey] = 0);
    domain.forEach(group => {
        let clone = JSON.parse(JSON.stringify(data.filter(d => d[grpKey as keyof object] == group)));
        clone.forEach((d, i) => {
            d[valKey] += base[i][valKey];
            base[i][valKey] = d[valKey];
        });
        groups.push(clone);
    });
    return groups;
}

export function getCSV(data: object[], keys = [], filename:string) {
    let str = '';
    const newkeys: object[] = [];
    keys.forEach(key => {
        if (key && !newkeys.includes(key)) {
            newkeys.push(key);
        }
    });
    str += newkeys.join(',') + '\n';
    data.forEach(d => {
        str += newkeys.map(key => d[key as keyof object]).join(',') + '\n';
    });
    const content = 'data:text/csv;charset=utf-8,' + encodeURI(str);
    download(content, filename + '.csv');
}

export function getPNG(target, filename:string) {
    html2canvas(target)
        .then(canvas => {
            const content = canvas.toDataURL();
            download(content, filename + '.png');
        });
}

function download(content:string, filename:string) {
    const a = document.createElement('a');
    a.href = content;
    a.download = filename;
    a.click();
}

export function commas(num:number) {
    const parts = String(num).split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}